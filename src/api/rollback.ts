import { Router, Request, Response } from 'express';
import { processRollback, RollbackRequest } from '../rollback/handler';

const router = Router();

/**
 * POST /api/rollback
 * Process a rollback request with conflict detection
 */
router.post('/rollback', async (req: Request, res: Response) => {
  try {
    const rollbackRequest: RollbackRequest = req.body;

    // Validate request
    if (!rollbackRequest.operationId || !Array.isArray(rollbackRequest.affectedResources)) {
      return res.status(400).json({
        error: 'Missing required fields: operationId and affectedResources',
      });
    }

    // Process the rollback
    const result = await processRollback(rollbackRequest);

    if (result.success) {
      res.status(200).json(result);
    } else {
      // Return 409 Conflict status when there's a rollback conflict
      res.status(409).json(result);
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
