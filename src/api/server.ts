import express from 'express';
import echoRouter from './routes/echo';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', echoRouter);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
