import { parseAddReadmeInput, parseProjectId, ValidationError } from '../readme.schema';
import {
  addReadme,
  canAddReadme,
  HttpError,
  type ProjectRole,
  type ReadmeDocument,
  type ReadmeStore,
} from '../readme.service';

function makeStore(overrides: Partial<ReadmeStore> = {}): ReadmeStore {
  let saved: ReadmeDocument | null = null;
  return {
    projectExists: async () => true,
    getRole: async (): Promise<ProjectRole | null> => 'maintainer',
    getReadme: async () => saved,
    saveReadme: async (doc) => {
      saved = doc;
      return doc;
    },
    ...overrides,
  };
}

const validInput = () => parseAddReadmeInput({ content: '# Hello' });

describe('parseAddReadmeInput', () => {
  it('applies defaults', () => {
    expect(parseAddReadmeInput({ content: 'hi' })).toEqual({
      content: 'hi',
      filename: 'README.md',
      overwrite: false,
    });
  });

  it.each([
    [{}, 'content'],
    [{ content: '   ' }, 'content'],
    [{ content: 'ok', filename: '../etc/passwd.md' }, 'filename'],
    [{ content: 'ok', filename: 'notes.txt' }, 'filename'],
    [{ content: 'ok', overwrite: 'yes' }, 'overwrite'],
  ])('rejects %p', (body, field) => {
    try {
      parseAddReadmeInput(body);
      throw new Error('expected ValidationError');
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).field).toBe(field);
      expect((err as ValidationError).status).toBe(400);
    }
  });

  it('rejects oversized content', () => {
    expect(() => parseAddReadmeInput({ content: 'a'.repeat(100_001) })).toThrow(
      /at most 100000 bytes/,
    );
  });

  it('validates project ids', () => {
    expect(parseProjectId(' 42 ')).toBe('42');
    expect(() => parseProjectId('bad id!')).toThrow(ValidationError);
  });
});

describe('canAddReadme', () => {
  it('allows owners, maintainers and admins', () => {
    expect(canAddReadme('owner', { id: 'u1' })).toBe(true);
    expect(canAddReadme('maintainer', { id: 'u1' })).toBe(true);
    expect(canAddReadme(null, { id: 'u1', isAdmin: true })).toBe(true);
  });

  it('denies contributors, viewers and non-members', () => {
    expect(canAddReadme('contributor', { id: 'u1' })).toBe(false);
    expect(canAddReadme('viewer', { id: 'u1' })).toBe(false);
    expect(canAddReadme(null, { id: 'u1' })).toBe(false);
  });
});

describe('addReadme', () => {
  it('creates a README for an authorized user', async () => {
    const result = await addReadme(makeStore(), 'p1', { id: 'u1' }, validInput());
    expect(result.created).toBe(true);
    expect(result.readme).toMatchObject({
      projectId: 'p1',
      filename: 'README.md',
      content: '# Hello',
      updatedBy: 'u1',
    });
  });

  it('requires authentication', async () => {
    await expect(addReadme(makeStore(), 'p1', null, validInput())).rejects.toMatchObject({
      status: 401,
    });
  });

  it('rejects users without the required role', async () => {
    const store = makeStore({ getRole: async () => 'viewer' });
    await expect(addReadme(store, 'p1', { id: 'u1' }, validInput())).rejects.toMatchObject({
      status: 403,
    });
  });

  it('404s for unknown projects', async () => {
    const store = makeStore({ projectExists: async () => false });
    await expect(addReadme(store, 'nope', { id: 'u1' }, validInput())).rejects.toBeInstanceOf(
      HttpError,
    );
  });

  it('conflicts when a README exists and overwrite is not set', async () => {
    const existing: ReadmeDocument = {
      projectId: 'p1',
      filename: 'README.md',
      content: 'old',
      updatedAt: new Date(0).toISOString(),
      updatedBy: 'u0',
    };
    const store = makeStore({ getReadme: async () => existing });
    await expect(addReadme(store, 'p1', { id: 'u1' }, validInput())).rejects.toMatchObject({
      status: 409,
    });

    const overwritten = await addReadme(
      store,
      'p1',
      { id: 'u1' },
      parseAddReadmeInput({ content: 'new', overwrite: true }),
    );
    expect(overwritten.created).toBe(false);
    expect(overwritten.readme.content).toBe('new');
  });
});
