/**
 * RollbackConflict represents a conflict between two rollback operations
 */
export interface RollbackConflict {
  operationId: string;
  affectedResources: string[];
  timestamp: number;
}

/**
 * ConflictManager handles detection and management of rollback operation conflicts
 */
export class ConflictManager {
  private pendingOperations: Map<string, RollbackConflict> = new Map();

  /**
   * Register a pending rollback operation
   */
  registerOperation(operationId: string, affectedResources: string[]): void {
    this.pendingOperations.set(operationId, {
      operationId,
      affectedResources,
      timestamp: Date.now(),
    });
  }

  /**
   * Unregister a completed rollback operation
   */
  unregisterOperation(operationId: string): void {
    this.pendingOperations.delete(operationId);
  }

  /**
   * Check if a new rollback operation conflicts with any pending operations
   * Returns true if there's a conflict, false otherwise
   */
  hasConflict(newOperationId: string, newResources: string[]): boolean {
    for (const [existingOpId, existingOp] of this.pendingOperations.entries()) {
      // Skip checking against itself
      if (existingOpId === newOperationId) {
        continue;
      }

      // Check if there's any resource overlap
      const newResourceSet = new Set(newResources);
      for (const resource of existingOp.affectedResources) {
        if (newResourceSet.has(resource)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get all pending operations
   */
  getPendingOperations(): RollbackConflict[] {
    return Array.from(this.pendingOperations.values());
  }

  /**
   * Clear all pending operations (useful for testing)
   */
  clear(): void {
    this.pendingOperations.clear();
  }
}

// Singleton instance
export const conflictManager = new ConflictManager();
