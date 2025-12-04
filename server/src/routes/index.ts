import { Router } from 'express';
import authRoutes from './auth';
import adminRoutes from './admin';
import companiesRoutes from './companies';
import obligationsRoutes from './obligations';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/companies', companiesRoutes);
router.use('/obligations', obligationsRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    },
  });
});

export default router;
