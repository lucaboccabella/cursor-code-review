/**
 * Express Server Configuration
 * 
 * Sets up the main Express application with API routes
 */

import express, { Express } from 'express';
import apiRouter from './api';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check endpoint (no authentication)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
