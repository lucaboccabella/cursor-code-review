import express from 'express';
import statusRouter from './routes/status';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes - Status endpoint with no auth middleware
app.use('/api', statusRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
