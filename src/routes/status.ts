import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint for deployment verification
 * Returns minimal response to verify service is running
 */
router.get('/status', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

export default router;
