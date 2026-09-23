import { Router, Request, Response } from 'express';

interface AnonymousUser {
  id: string;
  name: string;
  email: string;
  authenticated: boolean;
}

const router = Router();

/**
 * GET /api/whoami
 * Returns minimal anonymous user object
 */
router.get('/', (req: Request, res: Response) => {
  const anonymousUser: AnonymousUser = {
    id: 'anonymous',
    name: 'Anonymous User',
    email: 'anonymous@example.com',
    authenticated: false,
  };

  res.status(200).json(anonymousUser);
});

export default router;
