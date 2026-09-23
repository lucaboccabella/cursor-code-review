import express, { Application } from 'express';
import pingRouter from './routes/ping';
import { isPublicRoute } from './middleware/public-routes';

const app: Application = express();

// Middleware that skips auth for public routes
app.use((req, res, next) => {
  if (isPublicRoute(req.path)) {
    return next();
  }
  // Authentication middleware would be applied here for protected routes
  next();
});

// Mount public routes
app.use('/api', pingRouter);

// Additional API routes would be mounted here

export default app;
