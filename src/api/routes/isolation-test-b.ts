/**
 * Isolation Test B Route Handler
 * 
 * This route is part of Pipeline B and should remain on the develop branch only.
 * It provides a marker endpoint to verify branch isolation.
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/marker-isolation-test-b
 * 
 * Returns a minimal response to verify endpoint availability.
 * No authentication required.
 * 
 * @returns {Object} Minimal JSON response with isolation-test-b marker
 */
router.get('/marker-isolation-test-b', (req: Request, res: Response) => {
  res.status(200).json({
    'isolation-test-b': true
  });
});

export default router;
