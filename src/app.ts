/**
 * Express application setup
 * Configures routes and middleware
 */

import express from 'express';
import versionRoutes from './routes/version';

const app = express();

// Middleware
app.use(express.json());

// Routes - Version endpoint (no auth required)
app.use('/api', versionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
