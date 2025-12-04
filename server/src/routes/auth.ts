import { Router, Response } from 'express';
import { authService } from '../services/authService';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema, passwordSchema } from '../utils/validation';
import { AuthRequest, ApiResponse } from '../types';
import { z } from 'zod';

const router = Router();

router.post('/register', authLimiter, async (req, res: Response<ApiResponse>) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    
    res.status(201).json({
      success: true,
      data: result,
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
    
    res.json({
      success: true,
      data: result,
      message: 'Login realizado com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.post('/refresh', async (req, res: Response<ApiResponse>) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Token de atualização não fornecido',
      });
    }
    
    const tokens = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(req.user!.userId, refreshToken);
    
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

export default router;
