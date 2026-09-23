import { conflictManager, ConflictManager } from '../rollback/conflictManager';
import { processRollback } from '../rollback/handler';

describe('Rollback Conflict Detection', () => {
  beforeEach(() => {
    conflictManager.clear();
  });

  describe('ConflictManager', () => {
    it('should register and unregister operations', () => {
      const operationId = 'op-1';
      const resources = ['resource-1', 'resource-2'];

      conflictManager.registerOperation(operationId, resources);
      expect(conflictManager.getPendingOperations()).toHaveLength(1);

      conflictManager.unregisterOperation(operationId);
      expect(conflictManager.getPendingOperations()).toHaveLength(0);
    });

    it('should detect conflicts when resources overlap', () => {
      conflictManager.registerOperation('op-1', ['resource-1', 'resource-2']);

      // This operation conflicts because it shares resource-1
      const hasConflict = conflictManager.hasConflict('op-2', ['resource-1', 'resource-3']);
      expect(hasConflict).toBe(true);
    });

    it('should not detect conflicts when resources do not overlap', () => {
      conflictManager.registerOperation('op-1', ['resource-1', 'resource-2']);

      // This operation does not conflict
      const hasConflict = conflictManager.hasConflict('op-2', ['resource-3', 'resource-4']);
      expect(hasConflict).toBe(false);
    });

    it('should handle multiple pending operations correctly', () => {
      conflictManager.registerOperation('op-1', ['resource-1']);
      conflictManager.registerOperation('op-2', ['resource-2']);

      // Conflicts with op-1
      expect(conflictManager.hasConflict('op-3', ['resource-1'])).toBe(true);

      // Conflicts with op-2
      expect(conflictManager.hasConflict('op-3', ['resource-2'])).toBe(true);

      // Conflicts with both
      expect(conflictManager.hasConflict('op-3', ['resource-1', 'resource-2'])).toBe(true);

      // Conflicts with neither
      expect(conflictManager.hasConflict('op-3', ['resource-3'])).toBe(false);
    });
  });

  describe('Rollback Request Processing', () => {
    it('should allow rollback when no conflicts exist', async () => {
      const result = await processRollback({
        operationId: 'op-1',
        affectedResources: ['resource-1'],
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully');
    });

    it('should reject rollback when conflicts exist', async () => {
      // Register a pending operation
      conflictManager.registerOperation('op-1', ['resource-1']);

      // Try to process a conflicting rollback
      const result = await processRollback({
        operationId: 'op-2',
        affectedResources: ['resource-1'],
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('conflicts');
    });
  });
});
