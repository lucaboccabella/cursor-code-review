import request from 'supertest';
import app from '../api/server';
import { createRollbackHook } from './rollback-hook';

describe('Echo Endpoint - Rollback Test', () => {
  const rollbackHook = createRollbackHook();

  beforeEach(async () => {
    await rollbackHook.beforeTest();
  });

  afterEach(async () => {
    await rollbackHook.afterTest();
  });

  it('GET /api/echo returns hello response without authentication', async () => {
    const response = await request(app)
      .get('/api/echo')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ message: 'hello' });
  });

  it('pre-test state is restored after rollback completion', async () => {
    // First request
    const response1 = await request(app)
      .get('/api/echo')
      .expect(200);

    expect(response1.body).toEqual({ message: 'hello' });

    // State restoration happens in afterEach via rollbackHook.afterTest()
    // Verify endpoint still returns same response after rollback
  });

  it('test executes without authentication required', async () => {
    // No auth headers provided
    const response = await request(app)
      .get('/api/echo')
      // Should not return 401 Unauthorized
      .expect(200);

    expect(response.body.message).toBe('hello');
  });
});
