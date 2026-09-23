import app from '../src/app';
import request from 'supertest';

describe('Develop to Main Flow', () => {
  describe('GET /api/whoami', () => {
    it('should return anonymous user with minimal data', async () => {
      const response = await request(app).get('/api/whoami');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'anonymous');
      expect(response.body).toHaveProperty('authenticated', false);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
    });
  });

  describe('Promote → Main → Rollback cycle', () => {
    it('should complete full promotion and rollback cycle', async () => {
      // Step 1: Get initial branch state
      const initialState = await request(app).get('/api/branch/state');
      expect(initialState.status).toBe(200);
      const initialCommitCount = initialState.body.commitHistory.length;

      // Step 2: Promote develop to main
      const promoteResponse = await request(app).post('/api/branch/promote');
      expect(promoteResponse.status).toBe(200);
      expect(promoteResponse.body.success).toBe(true);
      expect(promoteResponse.body.fromBranch).toBe('develop');
      expect(promoteResponse.body.toBranch).toBe('main');

      // Step 3: Verify promotion by checking branch state
      const promotedState = await request(app).get('/api/branch/state');
      expect(promotedState.status).toBe(200);
      expect(promotedState.body.commitHistory.length).toBeGreaterThan(initialCommitCount);
      expect(promotedState.body.lastPromotion).toBeDefined();
      expect(promotedState.body.lastPromotion.fromBranch).toBe('develop');
      expect(promotedState.body.lastPromotion.toBranch).toBe('main');

      // Step 4: Rollback main
      const rollbackResponse = await request(app).post('/api/branch/rollback');
      expect(rollbackResponse.status).toBe(200);
      expect(rollbackResponse.body.success).toBe(true);
      expect(rollbackResponse.body.branch).toBe('main');
      expect(rollbackResponse.body.rolledBackToCommit).toBeDefined();

      // Step 5: Verify rollback by checking branch state
      const rolledBackState = await request(app).get('/api/branch/state');
      expect(rolledBackState.status).toBe(200);
      expect(rolledBackState.body.commitHistory.length).toBe(initialCommitCount);
      expect(rolledBackState.body.lastPromotion).toBeUndefined();
    });

    it('should not allow rollback without prior promotion', async () => {
      // Try to rollback without promoting first
      const rollbackResponse = await request(app).post('/api/branch/rollback');
      expect(rollbackResponse.status).toBe(500);
      expect(rollbackResponse.body.success).toBe(false);
    });
  });

  describe('Branch state validation', () => {
    it('should track branch state correctly', async () => {
      const stateResponse = await request(app).get('/api/branch/state');
      expect(stateResponse.status).toBe(200);
      expect(stateResponse.body).toHaveProperty('currentBranch');
      expect(stateResponse.body).toHaveProperty('commitHistory');
      expect(Array.isArray(stateResponse.body.commitHistory)).toBe(true);
    });
  });
});
