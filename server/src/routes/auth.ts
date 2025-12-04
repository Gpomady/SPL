import { Router, Response } from 'express';
import { authService } from '../services/authService';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema, passwordSchema } from '../utils/validation';
import { AuthRequest, ApiResponse } from '../types';
import { z } from 'zod';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

router.post('/register', authLimiter, async (req, res: Response<ApiResponse>) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
      message: 'Conta criada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.post('/login', authLimiter, async (req, res: Response<ApiResponse>) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    
    res.json({
      success: true,
      data: {
        user: result.user,
        companies: result.companies,
        accessToken: result.tokens.accessToken,
      },
      message: 'Login realizado com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.post('/switch-company', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { companyId } = req.body;
    
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'ID da empresa é obrigatório',
      });
    }
    
    const tokens = await authService.switchCompany(req.user!.userId, companyId);
    
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    
    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
      message: 'Empresa alterada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.post('/refresh', async (req, res: Response<ApiResponse>) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Token de atualização não encontrado',
      });
    }
    
    const tokens = await authService.refreshToken(refreshToken);
    
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    
    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    throw error;
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await authService.logout(req.user!.userId, refreshToken);
    
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.get('/profile', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const user = await authService.getProfile(req.user!.userId);
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw error;
  }
});

router.patch('/profile', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(2).max(255).optional(),
      avatar: z.string().url().optional(),
    });
    
    const data = updateSchema.parse(req.body);
    const user = await authService.updateProfile(req.user!.userId, data);
    
    res.json({
      success: true,
      data: user,
      message: 'Perfil atualizado com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.post('/change-password', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const schema = z.object({
      currentPassword: z.string(),
      newPassword: passwordSchema,
    });
    
    const { currentPassword, newPassword } = schema.parse(req.body);
    await authService.changePassword(req.user!.userId, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.get('/invitation/:token', async (req, res: Response<ApiResponse>) => {
  try {
    const { token } = req.params;
    const invitation = await authService.getInvitationByToken(token);
    
    res.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/accept-invitation', async (req, res: Response<ApiResponse>) => {
  try {
    const schema = z.object({
      token: z.string(),
      password: passwordSchema,
    });
    
    const data = schema.parse(req.body);
    const result = await authService.acceptInvitation(data);
    
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    
    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
      message: 'Conta ativada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

export default router;
