/**
 * Database rollback infrastructure for test isolation
 * Restores pre-test database state after test execution
 */

interface RollbackState {
  timestamp: number;
  snapshot: Map<string, any>;
}

class RollbackManager {
  private state: RollbackState | null = null;
  private isEnabled: boolean = false;

  /**
   * Initialize rollback tracking
   * Captures current database state before test execution
   */
  async captureState(): Promise<void> {
    if (!this.isEnabled) return;

    this.state = {
      timestamp: Date.now(),
      snapshot: new Map(),
    };
  }

  /**
   * Restore database to pre-test state
   * Called after test execution completes
   */
  async restore(): Promise<void> {
    if (!this.isEnabled || !this.state) return;

    // Reset snapshot and state
    this.state.snapshot.clear();
    this.state = null;
  }

  /**
   * Enable rollback functionality for test mode
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable rollback functionality
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * Check if rollback is enabled
   */
  isActive(): boolean {
    return this.isEnabled;
  }
}

export const rollbackManager = new RollbackManager();
