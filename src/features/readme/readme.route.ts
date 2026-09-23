import { Router, type Request, type Response, type NextFunction } from 'express';

import { parseAddReadmeInput, parseProjectId, ValidationError } from './readme.schema';
import {
  addReadme,
  HttpError,
  type AuthenticatedUser,
  type ReadmeStore,
} from './readme.service';

type AuthedRequest = Request & { user?: AuthenticatedUser | null };

export interface ReadmeRouterDeps {
  store: ReadmeStore;
  /** Existing auth guard; defaults to a pass-through that relies on req.user. */
  requireAuth?: (req: Request, res: Response, next: NextFunction) => void;
}

const defaultRequireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as AuthedRequest).user;
  if (!user || !user.id) {
    res.status(401).json({ error: 'unauthorized', message: 'Authentication is required.' });
    return;
  }
  next();
};

/**
 * POST /api/projects/:projectId/readme
 */
export function createReadmeRouter({ store, requireAuth }: ReadmeRouterDeps): Router {
  const router = Router();
  const guard = requireAuth ?? defaultRequireAuth;

  router.post(
    '/projects/:projectId/readme',
    guard,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const projectId = parseProjectId(req.params.projectId);
        const input = parseAddReadmeInput(req.body);
        const user = (req as AuthedRequest).user ?? null;

        const { readme, created } = await addReadme(store, projectId, user, input);
        res.status(created ? 201 : 200).json({ readme });
      } catch (err) {
        if (err instanceof ValidationError) {
          res.status(400).json({
            error: 'invalid_request',
            field: err.field,
            message: err.message,
          });
          return;
        }
        if (err instanceof HttpError) {
          res.status(err.status).json({
            error: httpErrorCode(err.status),
            message: err.message,
          });
          return;
        }
        res.status(500).json({
          error: 'internal_error',
          message: 'Unexpected error while saving the README.',
        });
      }
    },
  );

  return router;
}

function httpErrorCode(status: number): string {
  switch (status) {
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not_found';
    case 409:
      return 'conflict';
    default:
      return 'error';
  }
}
