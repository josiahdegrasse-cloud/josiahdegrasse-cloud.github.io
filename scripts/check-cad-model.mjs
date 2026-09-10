import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

export async function checkCadModel(path = "dist/models/lacrosse-head.mesh") {
  const bytes = await readFile(path);
  const vertices = bytes.readUInt32LE(0),
    indices = bytes.readUInt32LE(4);
  assert(vertices > 1000 && indices > 3000 && indices % 3 === 0);
  assert.equal(
    bytes.length,
    8 + vertices * 24 + indices * 4,
    "Complete mesh payload",
  );
  assert(bytes.length < 3_000_000, "Bounded display asset");
  const bounds = [
    [Infinity, -Infinity],
    [Infinity, -Infinity],
    [Infinity, -Infinity],
  ];
  for (let vertex = 0; vertex < vertices; vertex++) {
    let normalLengthSquared = 0;
    for (let axis = 0; axis < 3; axis++) {
      const p = bytes.readFloatLE(8 + vertex * 12 + axis * 4);
      const n = bytes.readFloatLE(8 + vertices * 12 + vertex * 12 + axis * 4);
      assert(
        Number.isFinite(p) && Number.isFinite(n),
        "Finite geometry and normals",
      );
      bounds[axis][0] = Math.min(bounds[axis][0], p);
      bounds[axis][1] = Math.max(bounds[axis][1], p);
      normalLengthSquared += n * n;
    }
    assert(
      Math.abs(normalLengthSquared - 1) < 0.002,
      "Normalized surface normals",
    );
  }
  for (let i = 0; i < indices; i++)
    assert(
      bytes.readUInt32LE(8 + vertices * 24 + i * 4) < vertices,
      "Valid triangle reference",
    );
  assert(
    Math.abs(bounds[1][1] - bounds[1][0] - 2.7) < 0.001,
    "Expected normalized height",
  );
  assert(
    bounds[0][1] - bounds[0][0] > 1 && bounds[2][1] - bounds[2][0] > 0.3,
    "Volumetric CAD geometry",
  );
  return { vertices, triangles: indices / 3, bytes: bytes.length };
}
