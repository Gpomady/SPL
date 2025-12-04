import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq, and, gt } from 'drizzle-orm';
import { db, users, refreshTokens } from '../db';
import { config } from '../config';
import { JwtPayload, TokenPair, RegisterRequest, LoginRequest } from '../types';
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
      })
      .returning();

    const tokens = await this.generateTokens(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword as typeof users.$inferSelect, tokens };
  }

  async login(data: LoginRequest): Promise<{ user: typeof users.$inferSelect; tokens: TokenPair }> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email.toLowerCase()),
    });

    if (!user) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Conta desativada');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    const tokens = await this.generateTokens(user);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as typeof users.$inferSelect, tokens };
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

    return this.generateTokens(user);
  }

  async logout(userId: string, token?: string): Promise<void> {
    if (token) {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    } else {
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }
  }

  async getProfile(userId: string): Promise<typeof users.$inferSelect> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as typeof users.$inferSelect;
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

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));

    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  private async generateTokens(user: typeof users.$inferSelect): Promise<TokenPair> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
