import { Router } from 'express';
import markerIsolationTestARouter from '../routes/markerIsolationTestA';

const apiRouter = Router();

// Register isolation test A route
apiRouter.use(markerIsolationTestARouter);

export default apiRouter;
