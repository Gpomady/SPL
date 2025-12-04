import { Router, Response } from 'express';
import { companyService } from '../services/companyService';
import { cnpjService } from '../services/cnpjService';
import { obligationService } from '../services/obligationService';
import { authenticate } from '../middleware/auth';
import { scrapingLimiter, apiLimiter } from '../middleware/rateLimiter';
import { companySchema, paginationSchema, cnpjSchema, cnaeSchema } from '../utils/validation';
import { AuthRequest, ApiResponse, CompanyCreateRequest } from '../types';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

router.get('/lookup/cnpj/:cnpj', scrapingLimiter, async (req, res: Response<ApiResponse>) => {
  try {
    const cnpj = cnpjSchema.parse(req.params.cnpj);
    const data = await cnpjService.lookup(cnpj);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/lookup/cnae/:cnae', async (req, res: Response<ApiResponse>) => {
  try {
    const cnae = cnaeSchema.parse(req.params.cnae);
    const data = await cnpjService.lookupCnae(cnae);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/', apiLimiter, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const params = paginationSchema.parse(req.query);
    const search = req.query.search as string | undefined;
    
    const result = await companyService.findByUser(req.user!.userId, { ...params, search });
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/stats', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const stats = await companyService.getStats(req.user!.userId);
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    throw error;
  }
});

router.get('/:id', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const company = await companyService.findById(req.params.id, req.user!.userId);
    
    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const data = companySchema.parse(req.body) as CompanyCreateRequest;
    const company = await companyService.create(req.user!.userId, data);
    
    res.status(201).json({
      success: true,
      data: company,
      message: 'Empresa cadastrada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const data = companySchema.partial().parse(req.body);
    const company = await companyService.update(req.params.id, req.user!.userId, data);
    
    res.json({
      success: true,
      data: company,
      message: 'Empresa atualizada com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    await companyService.delete(req.params.id, req.user!.userId);
    
    res.json({
      success: true,
      message: 'Empresa removida com sucesso',
    });
  } catch (error) {
    throw error;
  }
});

router.get('/:id/obligations', async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const params = paginationSchema.parse(req.query);
    const filters = {
      status: req.query.status as string | undefined,
      riskLevel: req.query.riskLevel as string | undefined,
      category: req.query.category as string | undefined,
      agency: req.query.agency as string | undefined,
    };
    
    const result = await obligationService.findByCompany(
      req.params.id,
      req.user!.userId,
      { ...params, ...filters }
    );
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/:id/generate-obligations', scrapingLimiter, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const result = await obligationService.generateForCompany(req.params.id, req.user!.userId);
    
    res.json({
      success: true,
      data: result,
      message: `${result.generated} obrigações identificadas e cadastradas`,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
