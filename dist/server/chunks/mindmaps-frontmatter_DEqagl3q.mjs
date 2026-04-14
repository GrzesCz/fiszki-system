import 'gray-matter';

function getMindmapsFromFrontmatter(data) {
  const mindmaps = data.mindmaps;
  if (Array.isArray(mindmaps) && mindmaps.length > 0) {
    return mindmaps.map((m) => ({
      file: String(m?.file ?? ""),
      rotation: [0, 90, 180, 270].includes(Number(m?.rotation)) ? Number(m.rotation) : 0,
      zoom: [50, 75, 100, 125, 150].includes(Number(m?.zoom)) ? Number(m.zoom) : 100
    }));
  }
  const legacy = data.mindmap;
  if (legacy && typeof legacy === "string") {
    return [
      {
        file: legacy,
        rotation: [0, 90, 180, 270].includes(Number(data.mindmap_rotation)) ? Number(data.mindmap_rotation) : 0,
        zoom: [50, 75, 100, 125, 150].includes(Number(data.mindmap_zoom)) ? Number(data.mindmap_zoom) : 100
      }
    ];
  }
  return [];
}

export { getMindmapsFromFrontmatter as g };
