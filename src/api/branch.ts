import { Router, Request, Response } from 'express';
import { BranchManager } from '../services/branchManager';

const router = Router();
const branchManager = new BranchManager();

interface PromoteResponse {
  success: boolean;
  message: string;
  fromBranch: string;
  toBranch: string;
  timestamp: string;
}

interface RollbackResponse {
  success: boolean;
  message: string;
  branch: string;
  rolledBackToCommit: string;
  timestamp: string;
}

interface BranchStateResponse {
  currentBranch: string;
  commitHistory: string[];
  lastPromotion?: {
    timestamp: string;
    fromBranch: string;
    toBranch: string;
    commit: string;
  };
}

/**
 * POST /api/branch/promote
 * Promotes develop branch to main
 */
router.post('/promote', async (req: Request, res: Response) => {
  try {
    const result = await branchManager.promoteToMain();

    const response: PromoteResponse = {
      success: true,
      message: 'Successfully promoted develop to main',
      fromBranch: 'develop',
      toBranch: 'main',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Promotion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

/**
 * POST /api/branch/rollback
 * Rolls back main branch to previous state
 */
router.post('/rollback', async (req: Request, res: Response) => {
  try {
    const result = await branchManager.rollbackMain();

    const response: RollbackResponse = {
      success: true,
      message: 'Successfully rolled back main branch',
      branch: 'main',
      rolledBackToCommit: result.previousCommit,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

/**
 * GET /api/branch/state
 * Returns current branch state and commit history
 */
router.get('/state', async (req: Request, res: Response) => {
  try {
    const state = await branchManager.getBranchState();

    const response: BranchStateResponse = {
      currentBranch: state.currentBranch,
      commitHistory: state.commitHistory,
      lastPromotion: state.lastPromotion,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get branch state: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

export default router;
