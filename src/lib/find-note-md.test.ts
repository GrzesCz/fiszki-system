import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readdir } from 'fs/promises';
import path from 'path';
import { findNoteMdPath, listNotatkiMdRelativePaths } from './find-note-md';

vi.mock('fs/promises', () => ({
  readdir: vi.fn(),
}));

const mockReaddir = vi.mocked(readdir);

function dirent(name: string, type: 'file' | 'dir') {
  return { name, isFile: () => type === 'file', isDirectory: () => type === 'dir' };
}

function mockFlatDir(files: string[]) {
  mockReaddir.mockResolvedValueOnce(files.map((f) => dirent(f, 'file')) as any);
}

function mockNestedDir(subdirName: string, files: string[]) {
  mockReaddir
    .mockResolvedValueOnce([dirent(subdirName, 'dir')] as any)
    .mockResolvedValueOnce(files.map((f) => dirent(f, 'file')) as any);
}

describe('find-note-md', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listNotatkiMdRelativePaths', () => {
    it('returns relative paths of all .md files recursively', async () => {
      mockReaddir
        .mockResolvedValueOnce([dirent('file1.md', 'file'), dirent('subdir', 'dir')] as any)
        .mockResolvedValueOnce([dirent('file2.md', 'file')] as any);

      expect(await listNotatkiMdRelativePaths()).toEqual(['file1.md', 'subdir/file2.md']);
    });

    it('ignores non-.md files', async () => {
      mockFlatDir(['note.md', 'image.png', 'doc.txt']);

      expect(await listNotatkiMdRelativePaths()).toEqual(['note.md']);
    });

    it('returns empty array for an empty directory', async () => {
      mockReaddir.mockResolvedValueOnce([] as any);

      expect(await listNotatkiMdRelativePaths()).toEqual([]);
    });
  });

  describe('findNoteMdPath', () => {
    beforeEach(() => {
      mockNestedDir('pytest', ['pytest-notatki.md']);
    });

    it('resolves exact slug match', async () => {
      const result = await findNoteMdPath('pytest/pytest-notatki');

      expect(result).not.toBeNull();
      expect(result!.endsWith(path.join('pytest', 'pytest-notatki.md'))).toBe(true);
    });

    it('resolves by base filename only (legacy behaviour)', async () => {
      const result = await findNoteMdPath('pytest-notatki');

      expect(result!.endsWith(path.join('pytest', 'pytest-notatki.md'))).toBe(true);
    });

    it('URL-decodes percent-encoded slugs', async () => {
      const result = await findNoteMdPath('pytest%2Fpytest-notatki');

      expect(result!.endsWith(path.join('pytest', 'pytest-notatki.md'))).toBe(true);
    });

    it('is case-insensitive', async () => {
      const result = await findNoteMdPath('PYTEST/PYTEST-NOTATKI');

      expect(result!.endsWith(path.join('pytest', 'pytest-notatki.md'))).toBe(true);
    });

    it('strips .md extension from slug', async () => {
      const result = await findNoteMdPath('pytest/pytest-notatki.md');

      expect(result!.endsWith(path.join('pytest', 'pytest-notatki.md'))).toBe(true);
    });

    it('returns null for non-existent slug', async () => {
      expect(await findNoteMdPath('nonexistent')).toBeNull();
    });
  });
});
