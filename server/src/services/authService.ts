import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { eq, and, gt } from 'drizzle-orm';
import { db, users, refreshTokens, companyMemberships, companies, invitations } from '../db';
import { config } from '../config';
import { JwtPayload, TokenPair, RegisterRequest, LoginRequest, GlobalRole, CompanyRole, UserWithMemberships, AcceptInvitationRequest } from '../types';
import { AppError, ConflictError, UnauthorizedError, NotFoundError } from '../middleware/errorHandler';

export class AuthService {
  async register(data: RegisterRequest): Promise<{ user: typeof users.$inferSelect; tokens: TokenPair }> {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email.toLowerCase()),
    });

    if (existingUser) {
      throw new ConflictError('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        globalRole: 'USER',
      })
      .returning();

    const tokens = await this.generateTokens(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword as typeof users.$inferSelect, tokens };
  }

  async login(data: LoginRequest): Promise<{ user: UserWithMemberships; tokens: TokenPair; companies: any[] }> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email.toLowerCase()),
    });

    if (!user) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Conta desativada');
    }

    if (!user.password) {
      throw new UnauthorizedError('Conta não configurada. Use o link de convite para definir sua senha.');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    const memberships = await db.query.companyMemberships.findMany({
      where: and(
        eq(companyMemberships.userId, user.id),
        eq(companyMemberships.status, 'active')
      ),
      with: {
        company: true,
      },
    });

    let activeCompanyId: string | undefined;
    let companyRole: CompanyRole | undefined;

    if (data.companyId) {
      const selectedMembership = memberships.find(m => m.companyId === data.companyId);
      if (selectedMembership) {
        activeCompanyId = selectedMembership.companyId;
        companyRole = selectedMembership.companyRole as CompanyRole;
      }
    } else if (memberships.length > 0) {
      activeCompanyId = memberships[0].companyId;
      companyRole = memberships[0].companyRole as CompanyRole;
    }

    const tokens = await this.generateTokens(user, activeCompanyId, companyRole);

    const { password, ...userWithoutPassword } = user;
    
    const userWithMemberships: UserWithMemberships = {
      ...userWithoutPassword,
      globalRole: user.globalRole as GlobalRole,
      memberships: memberships.map(m => ({
        id: m.id,
        companyId: m.companyId,
        companyRole: m.companyRole as CompanyRole,
        status: m.status as 'pending' | 'active' | 'suspended',
        company: {
          id: m.company.id,
          razaoSocial: m.company.razaoSocial,
          nomeFantasia: m.company.nomeFantasia,
          cnpj: m.company.cnpj,
          status: m.company.status as 'pending_setup' | 'active' | 'suspended' | 'cancelled',
        },
      })),
    };

    return { 
      user: userWithMemberships, 
      tokens,
      companies: memberships.map(m => m.company),
    };
  }

  async switchCompany(userId: string, companyId: string): Promise<TokenPair> {
    const membership = await db.query.companyMemberships.findFirst({
      where: and(
        eq(companyMemberships.userId, userId),
        eq(companyMemberships.companyId, companyId),
        eq(companyMemberships.status, 'active')
      ),
    });

    if (!membership) {
      throw new UnauthorizedError('Você não tem acesso a esta empresa');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    return this.generateTokens(user, companyId, membership.companyRole as CompanyRole);
  }

  async refreshToken(token: string): Promise<TokenPair> {
    const storedToken = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, token),
        gt(refreshTokens.expiresAt, new Date())
      ),
    });

    if (!storedToken) {
      throw new UnauthorizedError('Token inválido ou expirado');
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    } catch {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
      throw new UnauthorizedError('Token inválido');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuário não encontrado ou inativo');
    }

    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));

    return this.generateTokens(user, payload.activeCompanyId, payload.companyRole);
  }

  async logout(userId: string, token?: string): Promise<void> {
    if (token) {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    } else {
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }
  }

  async getProfile(userId: string): Promise<UserWithMemberships> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    const memberships = await db.query.companyMemberships.findMany({
      where: eq(companyMemberships.userId, userId),
      with: {
        company: true,
      },
    });

    const { password, ...userWithoutPassword } = user;
    
    return {
      ...userWithoutPassword,
      globalRole: user.globalRole as GlobalRole,
      memberships: memberships.map(m => ({
        id: m.id,
        companyId: m.companyId,
        companyRole: m.companyRole as CompanyRole,
        status: m.status as 'pending' | 'active' | 'suspended',
        company: {
          id: m.company.id,
          razaoSocial: m.company.razaoSocial,
          nomeFantasia: m.company.nomeFantasia,
          cnpj: m.company.cnpj,
          status: m.company.status as 'pending_setup' | 'active' | 'suspended' | 'cancelled',
        },
      })),
    };
  }

  async updateProfile(userId: string, data: Partial<{ name: string; avatar: string }>): Promise<typeof users.$inferSelect> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError('Usuário');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as typeof users.$inferSelect;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    if (user.password) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new UnauthorizedError('Senha atual incorreta');
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    await db
      .update(users)
      .set({ password: hashedPassword, mustChangePassword: false, updatedAt: new Date() })
      .where(eq(users.id, userId));

    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  async setPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    await db
      .update(users)
      .set({ 
        password: hashedPassword, 
        mustChangePassword: false,
        isActive: true,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async createInvitation(
    email: string, 
    name: string,
    companyId: string, 
    companyRole: CompanyRole,
    invitedBy: string
  ): Promise<{ invitation: typeof invitations.$inferSelect; user: typeof users.$inferSelect }> {
    let user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: email.toLowerCase(),
          name,
          globalRole: 'USER',
          isActive: false,
          mustChangePassword: true,
        })
        .returning();
    }

    const existingMembership = await db.query.companyMemberships.findFirst({
      where: and(
        eq(companyMemberships.userId, user.id),
        eq(companyMemberships.companyId, companyId)
      ),
    });

    if (existingMembership) {
      throw new ConflictError('Usuário já é membro desta empresa');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [invitation] = await db
      .insert(invitations)
      .values({
        email: email.toLowerCase(),
        companyId,
        companyRole,
        token,
        invitedBy,
        expiresAt,
      })
      .returning();

    return { invitation, user };
  }

  async acceptInvitation(data: AcceptInvitationRequest): Promise<{ user: typeof users.$inferSelect; tokens: TokenPair }> {
    const invitation = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.token, data.token),
        gt(invitations.expiresAt, new Date())
      ),
      with: {
        company: true,
      },
    });

    if (!invitation) {
      throw new UnauthorizedError('Convite inválido ou expirado');
    }

    if (invitation.acceptedAt) {
      throw new ConflictError('Este convite já foi utilizado');
    }

    let user = await db.query.users.findFirst({
      where: eq(users.email, invitation.email),
    });

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    [user] = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        isActive: true,
        mustChangePassword: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    await db
      .insert(companyMemberships)
      .values({
        companyId: invitation.companyId,
        userId: user.id,
        companyRole: invitation.companyRole,
        status: 'active',
        invitedBy: invitation.invitedBy,
        acceptedAt: new Date(),
      });

    await db
      .update(invitations)
      .set({ acceptedAt: new Date() })
      .where(eq(invitations.id, invitation.id));

    const tokens = await this.generateTokens(
      user, 
      invitation.companyId, 
      invitation.companyRole as CompanyRole
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as typeof users.$inferSelect, tokens };
  }

  async getInvitationByToken(token: string): Promise<any> {
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.token, token),
      with: {
        company: true,
      },
    });

    if (!invitation) {
      throw new NotFoundError('Convite');
    }

    if (invitation.acceptedAt) {
      throw new ConflictError('Este convite já foi utilizado');
    }

    if (invitation.expiresAt < new Date()) {
      throw new UnauthorizedError('Convite expirado');
    }

    return {
      email: invitation.email,
      companyName: invitation.company.razaoSocial || invitation.company.nomeFantasia,
      companyRole: invitation.companyRole,
      expiresAt: invitation.expiresAt,
    };
  }

  private async generateTokens(
    user: typeof users.$inferSelect, 
    activeCompanyId?: string,
    companyRole?: CompanyRole
  ): Promise<TokenPair> {
    const tokenId = crypto.randomBytes(16).toString('hex');
    
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      globalRole: user.globalRole as GlobalRole,
      activeCompanyId,
      companyRole,
    };

    const accessToken = jwt.sign({ ...payload, jti: tokenId }, config.jwt.accessSecret, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ ...payload, jti: tokenId }, config.jwt.refreshSecret, {
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
      await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt,
      });
    } catch (error: any) {
      if (error.code === '23505') {
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));
        await db.insert(refreshTokens).values({
          userId: user.id,
          token: refreshToken,
          expiresAt,
        });
      } else {
        throw error;
      }
    }

    return { accessToken, refreshToken };
  }

  async createMasterAdmin(email: string, password: string, name: string): Promise<typeof users.$inferSelect> {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      throw new ConflictError('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        globalRole: 'MASTER',
        isActive: true,
      })
      .returning();

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as typeof users.$inferSelect;
  }
}

export const authService = new AuthService();
