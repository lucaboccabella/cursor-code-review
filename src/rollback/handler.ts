import { conflictManager } from './conflictManager';

export interface RollbackRequest {
  operationId: string;
  affectedResources: string[];
}

export interface RollbackResult {
  success: boolean;
  operationId: string;
  message?: string;
}

/**
 * Process a rollback request with conflict detection
 * Returns success: true if the rollback can proceed, false if there's a conflict
 */
export async function processRollback(
  request: RollbackRequest
): Promise<RollbackResult> {
  const { operationId, affectedResources } = request;

  // Check for conflicts with pending operations
  if (conflictManager.hasConflict(operationId, affectedResources)) {
    return {
      success: false,
      operationId,
      message: 'Rollback operation conflicts with a pending operation',
    };
  }

  // Register the operation as pending
  conflictManager.registerOperation(operationId, affectedResources);

  try {
    // Simulate rollback execution
    await executeRollback(affectedResources);

    // Unregister the operation upon successful completion
    conflictManager.unregisterOperation(operationId);

    return {
      success: true,
      operationId,
      message: 'Rollback completed successfully',
    };
  } catch (error) {
    // Unregister even on failure
    conflictManager.unregisterOperation(operationId);

    return {
      success: false,
      operationId,
      message: `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Execute the actual rollback of resources
 */
async function executeRollback(affectedResources: string[]): Promise<void> {
  // Simulate rollback operations on each resource
  for (const resource of affectedResources) {
    // In a real implementation, this would perform actual rollback operations
    // For now, we just simulate the process
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
