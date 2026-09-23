import express, { Express } from 'express';
import whoamiRouter from './api/whoami';
import branchRouter from './api/branch';

const app: Express = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/whoami', whoamiRouter);
app.use('/api/branch', branchRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
