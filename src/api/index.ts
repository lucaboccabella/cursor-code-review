/**
 * API Router Configuration
 * 
 * Mounts all API route handlers
 */

import { Router } from 'express';
import isolationTestBRouter from './routes/isolation-test-b';

const apiRouter = Router();

// Mount the isolation test B route (develop branch only)
apiRouter.use('/', isolationTestBRouter);

export default apiRouter;
