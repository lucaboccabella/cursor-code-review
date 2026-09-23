import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/marker-isolation-test-a
 * Returns a minimal marker response for isolation test A
 * No authentication required
 */
router.get('/marker-isolation-test-a', (req: Request, res: Response) => {
  res.json({
    marker: 'isolation-test-a'
  });
});

export default router;
