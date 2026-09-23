import { Router } from 'express';
import { getReady } from '../api/ready';

const router = Router();

router.get('/api/ready', (req, res) => {
  const result = getReady();
  res.json(result);
});

export default router;
