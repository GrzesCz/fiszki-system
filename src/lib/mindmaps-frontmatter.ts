import matter from 'gray-matter';

export type MindmapItem = { file: string; rotation?: number; zoom?: number };

/** Pobiera listę map z frontmattera (obsługa legacy mindmap + mindmaps) */
export function getMindmapsFromFrontmatter(data: Record<string, unknown>): MindmapItem[] {
  const mindmaps = data.mindmaps as MindmapItem[] | undefined;
  if (Array.isArray(mindmaps) && mindmaps.length > 0) {
    return mindmaps.map((m) => ({
      file: String(m?.file ?? ''),
      rotation: [0, 90, 180, 270].includes(Number(m?.rotation)) ? Number(m.rotation) : 0,
      zoom: [50, 75, 100, 125, 150].includes(Number(m?.zoom)) ? Number(m.zoom) : 100,
    }));
  }
  const legacy = data.mindmap as string | undefined;
  if (legacy && typeof legacy === 'string') {
    return [
      {
        file: legacy,
        rotation: [0, 90, 180, 270].includes(Number(data.mindmap_rotation)) ? Number(data.mindmap_rotation) : 0,
        zoom: [50, 75, 100, 125, 150].includes(Number(data.mindmap_zoom)) ? Number(data.mindmap_zoom) : 100,
      },
    ];
  }
  return [];
}

/** Zapisuje mindmaps do frontmattera (usuwa legacy mindmap/mindmap_rotation/mindmap_zoom) */
export function setMindmapsInFrontmatter(content: string, maps: MindmapItem[]): string {
  const { data, content: body } = matter(content);
  const fm = data as Record<string, unknown>;

  delete fm.mindmap;
  delete fm.mindmap_rotation;
  delete fm.mindmap_zoom;
  fm.mindmaps = maps;

  return matter.stringify(body, fm);
}
