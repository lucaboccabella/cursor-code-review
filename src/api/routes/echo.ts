import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/echo
 * Returns a simple 'hello' response
 * No authentication required
 */
router.get('/echo', (req: Request, res: Response) => {
  res.json({ message: 'hello' });
});

export default router;
