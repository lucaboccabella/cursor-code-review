/**
 * Test rollback hook
 * Integrates with test framework to restore pre-test database state
 */

import { rollbackManager } from '../db/rollback';

export interface RollbackHook {
  beforeTest(): Promise<void>;
  afterTest(): Promise<void>;
}

export class TestRollbackHook implements RollbackHook {
  /**
   * Execute before each test
   * Captures current database state for rollback
   */
  async beforeTest(): Promise<void> {
    rollbackManager.enable();
    await rollbackManager.captureState();
  }

  /**
   * Execute after each test
   * Restores pre-test database state
   */
  async afterTest(): Promise<void> {
    await rollbackManager.restore();
    rollbackManager.disable();
  }
}

export const createRollbackHook = (): RollbackHook => {
  return new TestRollbackHook();
};
