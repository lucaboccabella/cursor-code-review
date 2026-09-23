import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/ping
 * Health check endpoint that responds with 'pong'
 * No authentication required
 */
router.get('/ping', (req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('pong');
});

export default router;
