import { Router, Response } from 'express';
import { obligationService } from '../services/obligationService';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';
import { obligationSchema, paginationSchema } from '../utils/validation';
import { AuthRequest, ApiResponse } from '../types';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

router.get('/', apiLimiter, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const params = paginationSchema.parse(req.query);
    const filters = {
      status: req.query.status as string | undefined,
      riskLevel: req.query.riskLevel as string | undefined,
    };
    
    const result = await obligationService.findByUser(req.user!.userId, { ...params, ...filters });
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/:id', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const obligation = await obligationService.findById(req.params.id, req.user!.userId);
    
    res.json({
      success: true,
      data: obligation,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const data = obligationSchema.parse(req.body);
    const obligation = await obligationService.create(req.user!.userId, data);
    
    res.status(201).json({
      success: true,
      data: obligation,
      message: 'Obrigação cadastrada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const data = obligationSchema.partial().parse(req.body);
    const obligation = await obligationService.update(req.params.id, req.user!.userId, data);
    
    res.json({
      success: true,
      data: obligation,
      message: 'Obrigação atualizada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.patch('/:id/status', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const statusSchema = z.object({
      status: z.enum(['pending', 'in_progress', 'completed', 'overdue', 'not_applicable']),
    });
    
    const { status } = statusSchema.parse(req.body);
    const obligation = await obligationService.updateStatus(req.params.id, req.user!.userId, status);
    
    res.json({
      success: true,
      data: obligation,
      message: 'Status atualizado com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    await obligationService.delete(req.params.id, req.user!.userId);
    
    res.json({
      success: true,
      message: 'Obrigação removida com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

export default router;
