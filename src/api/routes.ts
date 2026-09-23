import { Router } from 'express';
import healthRouter from './health/route';

const router = Router();

// Public endpoints (no auth required)
router.use('/health', healthRouter);

export default router;
