import { Router, Response } from 'express';
import { eq, desc, and, like, or } from 'drizzle-orm';
import { db, users, companies, companyMemberships, invitations } from '../db';
import { authenticate, requireGlobalRole } from '../middleware/auth';
import { authService } from '../services/authService';
import { AuthRequest, ApiResponse, CompanyCreateRequest, InviteUserRequest } from '../types';

const router = Router();

router.get('/stats', authenticate, requireGlobalRole('MASTER', 'PLATFORM_SUPPORT'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const totalCompanies = await db.query.companies.findMany();
    const totalUsers = await db.query.users.findMany();
    const pendingInvitations = await db.query.invitations.findMany({
      where: eq(invitations.acceptedAt, null as any),
    });

    const activeCompanies = totalCompanies.filter(c => c.status === 'active').length;
    const pendingSetup = totalCompanies.filter(c => c.status === 'pending_setup').length;

    res.json({
      success: true,
      data: {
        totalCompanies: totalCompanies.length,
        activeCompanies,
        pendingSetup,
        suspendedCompanies: totalCompanies.filter(c => c.status === 'suspended').length,
        totalUsers: totalUsers.length,
        activeUsers: totalUsers.filter(u => u.isActive).length,
        pendingInvitations: pendingInvitations.length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
    });
  }
});

router.get('/companies', authenticate, requireGlobalRole('MASTER', 'PLATFORM_SUPPORT'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { search, status, page = '1', limit = '10' } = req.query;
    
    let query = db.query.companies.findMany({
      orderBy: [desc(companies.createdAt)],
      with: {
        memberships: {
          with: {
            user: true,
          },
        },
      },
    });

    const allCompanies = await query;

    let filtered = allCompanies;
    
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filtered = filtered.filter(c => 
        c.razaoSocial.toLowerCase().includes(searchLower) ||
        (c.nomeFantasia && c.nomeFantasia.toLowerCase().includes(searchLower)) ||
        c.cnpj.includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const total = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      data: paginated.map(company => ({
        ...company,
        adminCount: company.memberships.filter(m => m.companyRole === 'ADMIN').length,
        userCount: company.memberships.length,
      })),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresas',
    });
  }
});

router.post('/companies', authenticate, requireGlobalRole('MASTER'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const data: CompanyCreateRequest = req.body;

    const existingCompany = await db.query.companies.findFirst({
      where: eq(companies.cnpj, data.cnpj),
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: 'CNPJ já cadastrado',
      });
    }

    const [newCompany] = await db
      .insert(companies)
      .values({
        cnpj: data.cnpj,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        email: data.email,
        phone: data.phone,
        state: data.state,
        city: data.city,
        address: data.address,
        cnaePrincipal: data.cnaePrincipal,
        cnaesSecundarios: data.cnaesSecundarios || [],
        status: 'pending_setup',
        slaTier: data.slaTier || 'standard',
        billingEmail: data.billingEmail,
        notes: data.notes,
        createdBy: req.user!.userId,
      })
      .returning();

    const { invitation, user } = await authService.createInvitation(
      data.adminEmail,
      data.adminName,
      newCompany.id,
      'ADMIN',
      req.user!.userId
    );

    res.status(201).json({
      success: true,
      data: {
        company: newCompany,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          token: invitation.token,
          expiresAt: invitation.expiresAt,
        },
      },
      message: 'Empresa cadastrada com sucesso. Convite enviado para o administrador.',
    });
  } catch (error: any) {
    console.error('Error creating company:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Erro ao cadastrar empresa',
    });
  }
});

router.get('/companies/:id', authenticate, requireGlobalRole('MASTER', 'PLATFORM_SUPPORT'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;

    const company = await db.query.companies.findFirst({
      where: eq(companies.id, id),
      with: {
        memberships: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresa',
    });
  }
});

router.patch('/companies/:id', authenticate, requireGlobalRole('MASTER'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(companies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    res.json({
      success: true,
      data: updated,
      message: 'Empresa atualizada com sucesso',
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar empresa',
    });
  }
});

router.post('/companies/:id/suspend', authenticate, requireGlobalRole('MASTER'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;

    const [updated] = await db
      .update(companies)
      .set({ status: 'suspended', updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    res.json({
      success: true,
      data: updated,
      message: 'Empresa suspensa com sucesso',
    });
  } catch (error) {
    console.error('Error suspending company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao suspender empresa',
    });
  }
});

router.post('/companies/:id/activate', authenticate, requireGlobalRole('MASTER'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;

    const [updated] = await db
      .update(companies)
      .set({ status: 'active', updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    res.json({
      success: true,
      data: updated,
      message: 'Empresa ativada com sucesso',
    });
  } catch (error) {
    console.error('Error activating company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao ativar empresa',
    });
  }
});

router.get('/users', authenticate, requireGlobalRole('MASTER', 'PLATFORM_SUPPORT'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { search, role, page = '1', limit = '10' } = req.query;

    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
      with: {
        memberships: {
          with: {
            company: true,
          },
        },
      },
    });

    let filtered = allUsers;

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }

    if (role && role !== 'all') {
      filtered = filtered.filter(u => u.globalRole === role);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const total = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      data: paginated.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários',
    });
  }
});

router.post('/invitations', authenticate, requireGlobalRole('MASTER'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const data: InviteUserRequest = req.body;

    const { invitation, user } = await authService.createInvitation(
      data.email,
      data.name,
      data.companyId,
      data.companyRole,
      req.user!.userId
    );

    res.status(201).json({
      success: true,
      data: {
        invitation: {
          id: invitation.id,
          email: invitation.email,
          token: invitation.token,
          expiresAt: invitation.expiresAt,
        },
      },
      message: 'Convite criado com sucesso',
    });
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Erro ao criar convite',
    });
  }
});

router.get('/invitations', authenticate, requireGlobalRole('MASTER', 'PLATFORM_SUPPORT'), async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { companyId, status } = req.query;

    let allInvitations = await db.query.invitations.findMany({
      orderBy: [desc(invitations.createdAt)],
      with: {
        company: true,
        inviter: true,
      },
    });

    if (companyId) {
      allInvitations = allInvitations.filter(i => i.companyId === companyId);
    }

    if (status === 'pending') {
      allInvitations = allInvitations.filter(i => !i.acceptedAt && i.expiresAt > new Date());
    } else if (status === 'accepted') {
      allInvitations = allInvitations.filter(i => i.acceptedAt);
    } else if (status === 'expired') {
      allInvitations = allInvitations.filter(i => !i.acceptedAt && i.expiresAt <= new Date());
    }

    res.json({
      success: true,
      data: allInvitations.map(inv => ({
        ...inv,
        inviter: inv.inviter ? { id: inv.inviter.id, name: inv.inviter.name, email: inv.inviter.email } : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar convites',
    });
  }
});

router.get('/setup-status', async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const existingMaster = await db.query.users.findFirst({
      where: eq(users.globalRole, 'MASTER'),
    });

    res.json({
      success: true,
      data: {
        needsSetup: !existingMaster,
        hasMasterAdmin: !!existingMaster,
      },
    });
  } catch (error) {
    console.error('Error checking setup status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status de configuração',
    });
  }
});

router.post('/create-master', async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const existingMaster = await db.query.users.findFirst({
      where: eq(users.globalRole, 'MASTER'),
    });

    if (existingMaster) {
      return res.status(409).json({
        success: false,
        message: 'Já existe um administrador master cadastrado',
      });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, senha e nome são obrigatórios',
      });
    }

    const user = await authService.createMasterAdmin(email, password, name);

    res.status(201).json({
      success: true,
      data: user,
      message: 'Administrador master criado com sucesso',
    });
  } catch (error: any) {
    console.error('Error creating master admin:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Erro ao criar administrador master',
    });
  }
});

export default router;
