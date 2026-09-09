import {BufferGeometry, Float32BufferAttribute} from "three";

export const projectCoverSize = {
  height: 3,
  width: 5.42,
} as const;

const tileCorners = [
  [-0.5, -0.5],
  [0.5, -0.5],
  [0.5, 0.5],
  [-0.5, 0.5],
] as const;

function deterministic(seed: string, index: number, channel: number) {
  let hash = 2166136261 ^ (index * 374761393) ^ (channel * 668265263);
  for (let offset = 0; offset < seed.length; offset += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(offset), 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

export function createFragmentedCoverGeometry(seed: string, columns: number, rows: number) {
  const geometry = new BufferGeometry();
  const positions: number[] = [];
  const centers: number[] = [];
  const scatters: number[] = [];
  const rotations: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const tileWidth = projectCoverSize.width / columns;
  const tileHeight = projectCoverSize.height / rows;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const tile = row * columns + column;
      const centerX = -projectCoverSize.width / 2 + (column + 0.5) * tileWidth;
      const centerY = -projectCoverSize.height / 2 + (row + 0.5) * tileHeight;
      const base = positions.length / 3;
      const scatter = [
        centerX / projectCoverSize.width + deterministic(seed, tile, 0) - 0.5,
        centerY / projectCoverSize.height * 0.7 + deterministic(seed, tile, 1) - 0.5,
        deterministic(seed, tile, 2) - 0.5,
      ];
      const rotation = [
        deterministic(seed, tile, 3) - 0.5,
        deterministic(seed, tile, 4) - 0.5,
      ];

      tileCorners.forEach(([x, y]) => {
        positions.push(x * tileWidth, y * tileHeight, 0);
        centers.push(centerX, centerY, 0);
        scatters.push(...scatter);
        rotations.push(...rotation);
        uvs.push((column + x + 0.5) / columns, (row + y + 0.5) / rows);
      });
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  }

  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aCenter", new Float32BufferAttribute(centers, 3));
  geometry.setAttribute("aScatter", new Float32BufferAttribute(scatters, 3));
  geometry.setAttribute("aRotation", new Float32BufferAttribute(rotations, 2));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}
