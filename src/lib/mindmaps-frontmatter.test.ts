import { describe, it, expect } from 'vitest';
import matter from 'gray-matter';
import { getMindmapsFromFrontmatter, setMindmapsInFrontmatter, type MindmapItem } from './mindmaps-frontmatter';

describe('getMindmapsFromFrontmatter', () => {
  describe('mindmaps array (new format)', () => {
    it('returns mapped items with valid rotation and zoom', () => {
      const result = getMindmapsFromFrontmatter({
        mindmaps: [
          { file: 'map1.png', rotation: 90, zoom: 125 },
          { file: 'map2.png', rotation: 0, zoom: 100 },
        ],
      });

      expect(result).toEqual([
        { file: 'map1.png', rotation: 90, zoom: 125 },
        { file: 'map2.png', rotation: 0, zoom: 100 },
      ]);
    });

    it.each([0, 90, 180, 270])('accepts valid rotation %i', (rotation) => {
      const [item] = getMindmapsFromFrontmatter({ mindmaps: [{ file: 'a.png', rotation, zoom: 100 }] });

      expect(item.rotation).toBe(rotation);
    });

    it.each([50, 75, 100, 125, 150])('accepts valid zoom %i', (zoom) => {
      const [item] = getMindmapsFromFrontmatter({ mindmaps: [{ file: 'a.png', rotation: 0, zoom }] });

      expect(item.zoom).toBe(zoom);
    });

    it('defaults invalid rotation to 0', () => {
      const [item] = getMindmapsFromFrontmatter({ mindmaps: [{ file: 'a.png', rotation: 45, zoom: 100 }] });

      expect(item.rotation).toBe(0);
    });

    it('defaults invalid zoom to 100', () => {
      const [item] = getMindmapsFromFrontmatter({ mindmaps: [{ file: 'a.png', rotation: 0, zoom: 200 }] });

      expect(item.zoom).toBe(100);
    });

    // Empty mindmaps array does NOT block legacy field — document this behaviour explicitly
    it('falls through to legacy when mindmaps is an empty array', () => {
      const result = getMindmapsFromFrontmatter({ mindmaps: [], mindmap: 'legacy.png' });

      expect(result).toEqual([{ file: 'legacy.png', rotation: 0, zoom: 100 }]);
    });
  });

  describe('legacy mindmap field', () => {
    it('converts legacy field to single-item array', () => {
      const result = getMindmapsFromFrontmatter({
        mindmap: 'old.png',
        mindmap_rotation: 180,
        mindmap_zoom: 75,
      });

      expect(result).toEqual([{ file: 'old.png', rotation: 180, zoom: 75 }]);
    });

    it('defaults invalid legacy rotation and zoom', () => {
      const result = getMindmapsFromFrontmatter({
        mindmap: 'old.png',
        mindmap_rotation: 999,
        mindmap_zoom: 999,
      });

      expect(result).toEqual([{ file: 'old.png', rotation: 0, zoom: 100 }]);
    });

    it('returns empty array when neither mindmaps nor legacy field is present', () => {
      expect(getMindmapsFromFrontmatter({})).toEqual([]);
    });
  });

  describe('precedence', () => {
    it('prefers mindmaps array over legacy mindmap field', () => {
      const result = getMindmapsFromFrontmatter({
        mindmaps: [{ file: 'new.png', rotation: 90, zoom: 125 }],
        mindmap: 'old.png',
      });

      expect(result).toEqual([{ file: 'new.png', rotation: 90, zoom: 125 }]);
    });
  });
});

describe('setMindmapsInFrontmatter', () => {
  it('writes mindmaps and removes all legacy fields', () => {
    const input = `---
mindmap: old.png
mindmap_rotation: 90
mindmap_zoom: 125
title: Test
---

Content here.`;

    const { data } = matter(
      setMindmapsInFrontmatter(input, [{ file: 'new.png', rotation: 180, zoom: 150 }]),
    );

    expect(data.mindmaps).toEqual([{ file: 'new.png', rotation: 180, zoom: 150 }]);
    expect(data.mindmap).toBeUndefined();
    expect(data.mindmap_rotation).toBeUndefined();
    expect(data.mindmap_zoom).toBeUndefined();
  });

  it('writes empty mindmaps array', () => {
    const { data } = matter(setMindmapsInFrontmatter('---\ntitle: Test\n---\n\nContent.', []));

    expect(data.mindmaps).toEqual([]);
  });

  it('overwrites existing mindmaps', () => {
    const input = `---
mindmaps:
  - file: existing.png
    rotation: 0
    zoom: 100
title: Test
---`;

    const { data } = matter(
      setMindmapsInFrontmatter(input, [{ file: 'replaced.png', rotation: 90, zoom: 125 }]),
    );

    expect(data.mindmaps).toHaveLength(1);
    expect(data.mindmaps[0].file).toBe('replaced.png');
  });

  it('preserves non-mindmap frontmatter fields', () => {
    const input = `---
title: My Note
status: w_trakcie
mindmap: x.png
---`;

    const { data } = matter(setMindmapsInFrontmatter(input, []));

    expect(data.title).toBe('My Note');
    expect(data.status).toBe('w_trakcie');
  });

  it('writes multiple maps', () => {
    const maps: MindmapItem[] = [
      { file: 'a.png', rotation: 0, zoom: 100 },
      { file: 'b.png', rotation: 90, zoom: 125 },
    ];

    const { data } = matter(setMindmapsInFrontmatter('---\ntitle: T\n---\n', maps));

    expect(data.mindmaps).toEqual(maps);
  });
});
