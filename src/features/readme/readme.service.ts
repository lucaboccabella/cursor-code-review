import {
  NormalizedReadmeInput,
  ValidationError,
} from './readme.schema';

export type ProjectRole = 'owner' | 'maintainer' | 'contributor' | 'viewer';

export interface AuthenticatedUser {
  id: string;
  isAdmin?: boolean;
}

export interface ReadmeDocument {
  projectId: string;
  filename: string;
  content: string;
  updatedAt: string;
  updatedBy: string;
}

/** Storage seam so the service can be unit tested and swapped per environment. */
export interface ReadmeStore {
  projectExists(projectId: string): Promise<boolean>;
  getRole(projectId: string, userId: string): Promise<ProjectRole | null>;
  getReadme(projectId: string): Promise<ReadmeDocument | null>;
  saveReadme(doc: ReadmeDocument): Promise<ReadmeDocument>;
}

export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const WRITE_ROLES: ReadonlySet<ProjectRole> = new Set<ProjectRole>(['owner', 'maintainer']);

export function canAddReadme(role: ProjectRole | null, user: AuthenticatedUser): boolean {
  if (user.isAdmin) return true;
  return role !== null && WRITE_ROLES.has(role);
}

export interface AddReadmeResult {
  readme: ReadmeDocument;
  created: boolean;
}

/**
 * Creates (or, with `overwrite`, replaces) the README for a project.
 *
 * Throws {@link ValidationError} for bad input and {@link HttpError} for
 * authorization / conflict failures so the transport layer can map them to
 * status codes.
 */
export async function addReadme(
  store: ReadmeStore,
  projectId: string,
  user: AuthenticatedUser | null,
  input: NormalizedReadmeInput,
  now: () => Date = () => new Date(),
): Promise<AddReadmeResult> {
  if (!user || !user.id) {
    throw new HttpError(401, 'Authentication is required to add a README.');
  }

  if (!(await store.projectExists(projectId))) {
    throw new HttpError(404, `Project "${projectId}" was not found.`);
  }

  const role = await store.getRole(projectId, user.id);
  if (!canAddReadme(role, user)) {
    throw new HttpError(
      403,
      'You must be a project owner or maintainer to add a README.',
    );
  }

  const existing = await store.getReadme(projectId);
  if (existing && !input.overwrite) {
    throw new HttpError(
      409,
      'A README already exists for this project. Resend with "overwrite": true to replace it.',
    );
  }

  const saved = await store.saveReadme({
    projectId,
    filename: input.filename,
    content: input.content,
    updatedAt: now().toISOString(),
    updatedBy: user.id,
  });

  return { readme: saved, created: existing === null };
}

export { ValidationError };
