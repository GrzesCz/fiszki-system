import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFile } from 'fs/promises';
import { renderNoteMarkdown } from './render-note-markdown';

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
}));

const mockReadFile = vi.mocked(readFile);

describe('renderNoteMarkdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('strips frontmatter and renders body as HTML', async () => {
    mockReadFile.mockResolvedValueOnce(
      '---\ntitle: Test\ncategory: Vibe Coding\n---\n\n# Heading\n\nSome **bold** text.'
    );

    const html = await renderNoteMarkdown('/fake/path.md');

    expect(html).not.toContain('title: Test');
    expect(html).not.toContain('---');
    expect(html).toContain('<h1');
    expect(html).toContain('Heading');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('renders paragraphs, lists and links', async () => {
    mockReadFile.mockResolvedValueOnce(
      'Intro paragraph.\n\n- item 1\n- item 2\n\n[link](https://example.com)'
    );

    const html = await renderNoteMarkdown('/fake/path.md');

    expect(html).toContain('<p>Intro paragraph.</p>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>item 1</li>');
    expect(html).toContain('<a href="https://example.com">link</a>');
  });

  it('renders fenced code blocks', async () => {
    mockReadFile.mockResolvedValueOnce('```js\nconst x = 1;\n```');

    const html = await renderNoteMarkdown('/fake/path.md');

    expect(html).toContain('<pre>');
    expect(html).toContain('<code');
    expect(html).toContain('const x = 1;');
  });

  it('renders files without frontmatter', async () => {
    mockReadFile.mockResolvedValueOnce('Just **plain** markdown.');

    const html = await renderNoteMarkdown('/fake/path.md');

    expect(html).toContain('<strong>plain</strong>');
  });

  it('renders GFM tables', async () => {
    mockReadFile.mockResolvedValueOnce(
      '| A | B |\n|---|---|\n| 1 | 2 |\n'
    );

    const html = await renderNoteMarkdown('/fake/path.md');

    expect(html).toContain('<table>');
    expect(html).toContain('<th>A</th>');
    expect(html).toContain('<td>1</td>');
  });

  it('reads directly from filesystem — does NOT use astro:content getCollection', async () => {
    mockReadFile.mockResolvedValueOnce('# Live Content');

    const html = await renderNoteMarkdown('/any/abs/path/file.md');

    expect(mockReadFile).toHaveBeenCalledWith('/any/abs/path/file.md', 'utf-8');
    expect(html).toContain('Live Content');
  });
});
