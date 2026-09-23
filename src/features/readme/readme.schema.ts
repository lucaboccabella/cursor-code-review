/**
 * Validation for the "add readme" feature.
 *
 * Kept dependency-free so it can be reused by the HTTP layer, background jobs
 * and tests without pulling in a validation framework.
 */

export const DEFAULT_README_FILENAME = 'README.md';
export const MAX_README_BYTES = 100_000;
export const MAX_FILENAME_LENGTH = 128;

const FILENAME_PATTERN = /^[A-Za-z0-9._-]+\.(md|markdown)$/;

export interface AddReadmeInput {
  content: string;
  filename?: string;
  overwrite?: boolean;
}

export interface NormalizedReadmeInput {
  content: string;
  filename: string;
  overwrite: boolean;
}

export class ValidationError extends Error {
  public readonly status = 400;
  public readonly field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseProjectId(raw: unknown): string {
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw new ValidationError('projectId', 'projectId is required.');
  }
  const projectId = raw.trim();
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(projectId)) {
    throw new ValidationError(
      'projectId',
      'projectId must be 1-64 characters of letters, numbers, hyphens or underscores.',
    );
  }
  return projectId;
}

export function parseAddReadmeInput(raw: unknown): NormalizedReadmeInput {
  if (!isPlainObject(raw)) {
    throw new ValidationError('body', 'Request body must be a JSON object.');
  }

  const { content, filename, overwrite } = raw as Partial<AddReadmeInput>;

  if (typeof content !== 'string') {
    throw new ValidationError('content', 'content is required and must be a string.');
  }
  if (content.trim().length === 0) {
    throw new ValidationError('content', 'content must not be empty.');
  }
  if (Buffer.byteLength(content, 'utf8') > MAX_README_BYTES) {
    throw new ValidationError(
      'content',
      `content must be at most ${MAX_README_BYTES} bytes.`,
    );
  }

  let normalizedFilename = DEFAULT_README_FILENAME;
  if (filename !== undefined) {
    if (typeof filename !== 'string') {
      throw new ValidationError('filename', 'filename must be a string.');
    }
    const trimmed = filename.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_FILENAME_LENGTH) {
      throw new ValidationError(
        'filename',
        `filename must be between 1 and ${MAX_FILENAME_LENGTH} characters.`,
      );
    }
    if (trimmed.includes('/') || trimmed.includes('\\') || trimmed.includes('..')) {
      throw new ValidationError('filename', 'filename must not contain path segments.');
    }
    if (!FILENAME_PATTERN.test(trimmed)) {
      throw new ValidationError(
        'filename',
        'filename must be a Markdown file ending in .md or .markdown.',
      );
    }
    normalizedFilename = trimmed;
  }

  if (overwrite !== undefined && typeof overwrite !== 'boolean') {
    throw new ValidationError('overwrite', 'overwrite must be a boolean.');
  }

  return {
    content: content.replace(/\r\n/g, '\n'),
    filename: normalizedFilename,
    overwrite: overwrite === true,
  };
}
