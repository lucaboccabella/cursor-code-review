/**
 * BranchManager handles branch promotion and rollback operations
 * Maintains state of develop and main branches for testing purposes
 */

interface BranchState {
  currentBranch: string;
  commitHistory: string[];
  lastPromotion?: {
    timestamp: string;
    fromBranch: string;
    toBranch: string;
    commit: string;
  };
}

interface PromotionResult {
  success: boolean;
  promotedCommit: string;
}

interface RollbackResult {
  success: boolean;
  previousCommit: string;
}

export class BranchManager {
  private mainCommitHistory: string[] = ['initial-commit'];
  private developCommitHistory: string[] = ['initial-commit', 'develop-feature-1', 'develop-feature-2'];
  private lastPromotionRecord?: {
    timestamp: string;
    fromBranch: string;
    toBranch: string;
    commit: string;
  };

  /**
   * Promotes the develop branch to main
   * Simulates a merge by copying the latest develop commits to main
   */
  async promoteToMain(): Promise<PromotionResult> {
    try {
      // Get the latest commit from develop
      const latestDevelopCommit = this.developCommitHistory[this.developCommitHistory.length - 1];

      if (!latestDevelopCommit) {
        throw new Error('No commits found in develop branch');
      }

      // Check if this commit is already in main
      if (this.mainCommitHistory.includes(latestDevelopCommit)) {
        throw new Error('Latest develop commit is already in main');
      }

      // Add all develop commits that are not in main
      const newCommits = this.developCommitHistory.filter(
        (commit) => !this.mainCommitHistory.includes(commit)
      );

      if (newCommits.length === 0) {
        throw new Error('No new commits to promote');
      }

      // Promote commits to main
      this.mainCommitHistory.push(...newCommits);

      // Record the promotion
      this.lastPromotionRecord = {
        timestamp: new Date().toISOString(),
        fromBranch: 'develop',
        toBranch: 'main',
        commit: latestDevelopCommit,
      };

      return {
        success: true,
        promotedCommit: latestDevelopCommit,
      };
    } catch (error) {
      throw new Error(`Failed to promote develop to main: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Rolls back the main branch to its previous state
   * Removes commits that were added during the last promotion
   */
  async rollbackMain(): Promise<RollbackResult> {
    try {
      if (!this.lastPromotionRecord) {
        throw new Error('No promotion record found for rollback');
      }

      // Get the commits that were promoted
      const promotedCommit = this.lastPromotionRecord.commit;
      const promotedIndex = this.mainCommitHistory.indexOf(promotedCommit);

      if (promotedIndex === -1) {
        throw new Error('Cannot find promoted commit in main branch history');
      }

      // Determine the previous commit before promotion
      const previousCommit = this.mainCommitHistory[promotedIndex - 1] || 'initial-commit';

      // Rollback: remove all commits after the previous state
      this.mainCommitHistory = this.mainCommitHistory.slice(0, promotedIndex);

      // Clear the promotion record after successful rollback
      this.lastPromotionRecord = undefined;

      return {
        success: true,
        previousCommit,
      };
    } catch (error) {
      throw new Error(`Failed to rollback main: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the current state of branches
   */
  async getBranchState(): Promise<BranchState> {
    return {
      currentBranch: 'main',
      commitHistory: [...this.mainCommitHistory],
      lastPromotion: this.lastPromotionRecord,
    };
  }

  /**
   * Resets the branch state for testing
   */
  async resetState(): Promise<void> {
    this.mainCommitHistory = ['initial-commit'];
    this.developCommitHistory = ['initial-commit', 'develop-feature-1', 'develop-feature-2'];
    this.lastPromotionRecord = undefined;
  }
}
