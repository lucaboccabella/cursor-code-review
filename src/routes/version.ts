/**
 * Version route configuration
 * Defines the GET /api/version endpoint with no authentication
 */

import { Router, Request, Response } from 'express';
import { getVersion } from '../api/version';

const router = Router();

/**
 * GET /api/version
 * Returns the API version
 * No authentication required
 */
router.get('/version', (req: Request, res: Response) => {
  try {
    const versionData = getVersion();
    res.status(200).json(versionData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
