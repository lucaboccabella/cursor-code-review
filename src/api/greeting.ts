import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/greeting
 * Returns a simple greeting message with no authentication required
 */
router.get('/greeting', (req: Request, res: Response) => {
  res.json({ message: 'hi' });
});

export default router;
