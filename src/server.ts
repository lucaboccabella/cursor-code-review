import express from 'express';
import readyRoutes from './routes/ready';

const app = express();

// Mount routes
app.use(readyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
