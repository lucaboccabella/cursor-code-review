import { Router, Request, Response } from 'express';
import { getHealth } from './handler';

const router = Router();

/**
 * GET /api/health
 * Public health check endpoint
 * Returns HTTP 200 with status and UTC ISO timestamp
 * No authentication required
 */
router.get('/', (req: Request, res: Response) => {
  const healthData = getHealth();
  res.status(200).json(healthData);
});

export default router;
