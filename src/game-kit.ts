import * as THREE from "three";
import type { Collider } from "./game-types";

export const colors = {
  ink: 0x17130f,
  white: 0xfff9e9,
  red: 0xd82f24,
  yellow: 0xf6c83f,
  green: 0x174f3a,
  mint: 0x80c9a5,
  blue: 0x2367b1,
  powder: 0x91c8ed,
  pink: 0xf26a8d,
  orange: 0xf47a31,
  walnut: 0x5b321f,
  chrome: 0xbcc7cb,
  oxblood: 0x6e1720,
  tuftsBlue: 0x3e8ede,
  tuftsBrown: 0x5f4638,
  steel: 0x667278,
  concrete: 0x777873,
  charcoal: 0x292b2c,
  sage: 0x8aa287,
  cheese: 0xf3c860,
};

/** Build an XZ collision box from a center point and half-extents (the player walks at fixed height). */
export function blocker(centerX: number, centerZ: number, halfX: number, halfZ: number): Collider {
  return {
    minX: centerX - halfX,
    maxX: centerX + halfX,
    minZ: centerZ - halfZ,
    maxZ: centerZ + halfZ,
  };
}

export function material(color: number, options: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.58,
    metalness: 0.04,
    ...options,
  });
}

export function box(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  color: number,
  options: THREE.MeshStandardMaterialParameters = {},
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, options));
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function cylinder(
  parent: THREE.Object3D,
  radius: number,
  height: number,
  position: [number, number, number],
  color: number,
  radialSegments = 24,
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, radialSegments),
    material(color),
  );
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function plane(
  parent: THREE.Object3D,
  size: [number, number],
  position: [number, number, number],
  color: number,
  rotation: [number, number, number] = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), material(color));
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

export function canvasTexture(
  title: string,
  subtitle = "",
  background = "#fff9e9",
  foreground = "#17130f",
  accent = "#d82f24",
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.fillRect(0, 0, 48, canvas.height);
  context.strokeStyle = foreground;
  context.lineWidth = 14;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
  context.fillStyle = foreground;
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.font = "900 92px Arial Narrow, Arial, sans-serif";
  context.fillText(title.toUpperCase(), 92, subtitle ? 210 : 256, 850);
  if (subtitle) {
    context.font = "700 38px Arial, sans-serif";
    context.fillText(subtitle, 94, 326, 830);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function sign(
  parent: THREE.Object3D,
  title: string,
  subtitle: string,
  position: [number, number, number],
  background: string,
  foreground: string,
  accent: string,
  size: [number, number] = [5.4, 2.7],
) {
  const frame = box(parent, [size[0] + 0.22, size[1] + 0.22, 0.16], position, colors.walnut);
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(...size),
    new THREE.MeshBasicMaterial({
      map: canvasTexture(title, subtitle, background, foreground, accent),
    }),
  );
  face.position.copy(frame.position);
  face.position.z += 0.09;
  parent.add(face);
  return face;
}

export function imagePanel(
  parent: THREE.Object3D,
  url: string,
  position: [number, number, number],
  size: [number, number],
) {
  const frame = box(parent, [size[0] + 0.24, size[1] + 0.24, 0.16], position, colors.walnut);
  const panelMaterial = new THREE.MeshBasicMaterial({ color: colors.white });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(...size), panelMaterial);
  panel.position.copy(frame.position);
  panel.position.z += 0.09;
  parent.add(panel);
  new THREE.TextureLoader().load(url, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    panelMaterial.map = texture;
    panelMaterial.needsUpdate = true;
  });
  return panel;
}

export function roomShell(
  parent: THREE.Group,
  z: number,
  floorColor: number,
  wallColor: number,
  accent: number,
) {
  box(parent, [15, 0.25, 22], [0, -0.16, z], floorColor);
  box(parent, [0.3, 6.5, 22], [-7.35, 3.1, z], wallColor);
  box(parent, [0.3, 6.5, 22], [7.35, 3.1, z], wallColor);
  for (let offset = -9; offset <= 9; offset += 3) {
    box(parent, [0.08, 0.02, 1.4], [0, -0.02, z + offset], accent, {
      emissive: accent,
      emissiveIntensity: 0.7,
    });
  }
  for (const side of [-1, 1]) {
    for (let offset = -8; offset <= 8; offset += 4) {
      box(parent, [0.28, 3.8, 2.8], [side * 7.08, 2, z + offset], accent);
      box(parent, [0.34, 0.14, 2.2], [side * 6.88, 3.35, z + offset], colors.chrome, {
        metalness: 0.7,
        roughness: 0.24,
      });
    }
  }
}

export function spotlight(
  parent: THREE.Object3D,
  color: number,
  position: [number, number, number],
  target: [number, number, number],
  intensity = 45,
) {
  const light = new THREE.SpotLight(color, intensity, 20, Math.PI / 4, 0.45, 1.2);
  light.position.set(...position);
  light.target.position.set(...target);
  parent.add(light, light.target);
  return light;
}

export function makeLacrosseHead(color: number) {
  const group = new THREE.Group();
  const headMaterial = material(color, { roughness: 0.28 });
  const frameCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.86, 0),
    new THREE.Vector3(-0.4, -0.55, 0),
    new THREE.Vector3(-0.56, 0.08, 0),
    new THREE.Vector3(-0.64, 0.66, 0),
    new THREE.Vector3(0, 0.92, 0),
    new THREE.Vector3(0.64, 0.66, 0),
    new THREE.Vector3(0.56, 0.08, 0),
    new THREE.Vector3(0.4, -0.55, 0),
    new THREE.Vector3(0, -0.86, 0),
  ], false, "catmullrom", 0.3);
  const frame = new THREE.Mesh(
    new THREE.TubeGeometry(frameCurve, 56, 0.065, 10, false),
    headMaterial,
  );
  group.add(frame);
  const throat = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.21, 0.52, 14), headMaterial);
  throat.position.y = -1.08;
  group.add(throat);
  for (let row = 0; row < 5; row += 1) {
    const string = box(group, [0.98 - row * 0.1, 0.022, 0.022], [0, 0.54 - row * 0.27, 0], colors.white);
    string.rotation.z = row % 2 ? 0.08 : -0.08;
  }
  for (const x of [-0.32, -0.1, 0.1, 0.32]) {
    const string = box(group, [0.018, 1.2, 0.018], [x, 0.02, 0.01], colors.white);
    string.rotation.z = x * -0.08;
  }
  return group;
}

export function floor(
  parent: THREE.Object3D,
  size: [number, number],
  position: [number, number, number],
  color: number,
) {
  return box(parent, [size[0], 0.24, size[1]], position, color);
}

export function wall(
  parent: THREE.Object3D,
  size: [number, number],
  position: [number, number, number],
  color: number,
  rotationY = 0,
) {
  const mesh = box(parent, [size[0], size[1], 0.24], position, color);
  mesh.rotation.y = rotationY;
  return mesh;
}

export function table(
  parent: THREE.Object3D,
  position: [number, number, number],
  size: [number, number] = [3.4, 1.8],
  topColor = colors.walnut,
  legColor = colors.ink,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  parent.add(group);
  box(group, [size[0], 0.18, size[1]], [0, 1.25, 0], topColor);
  for (const x of [-size[0] / 2 + 0.25, size[0] / 2 - 0.25]) {
    for (const z of [-size[1] / 2 + 0.22, size[1] / 2 - 0.22]) {
      box(group, [0.15, 1.2, 0.15], [x, 0.62, z], legColor);
    }
  }
  return group;
}

export function chair(
  parent: THREE.Object3D,
  position: [number, number, number],
  color: number,
  rotationY = 0,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.y = rotationY;
  parent.add(group);
  box(group, [1, 0.18, 1], [0, 0.78, 0], color);
  box(group, [1, 1.25, 0.16], [0, 1.45, 0.43], color);
  for (const x of [-0.38, 0.38]) {
    for (const z of [-0.38, 0.38]) box(group, [0.1, 0.78, 0.1], [x, 0.38, z], colors.ink);
  }
  return group;
}

export function shelf(
  parent: THREE.Object3D,
  position: [number, number, number],
  size: [number, number, number],
  color = colors.walnut,
  shelves = 4,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  parent.add(group);
  box(group, [0.18, size[1], size[2]], [-size[0] / 2, size[1] / 2, 0], color);
  box(group, [0.18, size[1], size[2]], [size[0] / 2, size[1] / 2, 0], color);
  for (let index = 0; index <= shelves; index += 1) {
    box(group, [size[0], 0.14, size[2]], [0, index * (size[1] / shelves), 0], color);
  }
  return group;
}

export function laptop(
  parent: THREE.Object3D,
  position: [number, number, number],
  screenColor = colors.powder,
  rotationY = 0,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.y = rotationY;
  parent.add(group);
  box(group, [1.7, 0.09, 1.1], [0, 0, 0], colors.charcoal, { metalness: 0.35 });
  const screen = box(group, [1.7, 1.1, 0.08], [0, 0.58, -0.5], colors.charcoal, { metalness: 0.3 });
  screen.rotation.x = -0.12;
  box(group, [1.48, 0.88, 0.03], [0, 0.58, -0.45], screenColor, {
    emissive: screenColor,
    emissiveIntensity: 0.45,
  }).rotation.x = -0.12;
  return group;
}

export function speaker(
  parent: THREE.Object3D,
  position: [number, number, number],
  color = colors.walnut,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  parent.add(group);
  box(group, [1.55, 4.2, 1.35], [0, 2.1, 0], color);
  for (const [y, radius] of [[1.2, 0.48], [2.35, 0.62], [3.45, 0.28]] as const) {
    const cone = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 0.72, 0.12, 32),
      material(colors.ink, { roughness: 0.82 }),
    );
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, y, 0.72);
    group.add(cone);
  }
  return group;
}

export function couch(
  parent: THREE.Object3D,
  position: [number, number, number],
  color: number,
  rotationY = 0,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.y = rotationY;
  parent.add(group);
  box(group, [4.4, 0.65, 1.8], [0, 0.65, 0], color);
  box(group, [4.4, 1.35, 0.4], [0, 1.45, 0.7], color);
  box(group, [0.45, 1.2, 1.8], [-2.05, 0.9, 0], color);
  box(group, [0.45, 1.2, 1.8], [2.05, 0.9, 0], color);
  return group;
}

export function board(
  parent: THREE.Object3D,
  position: [number, number, number],
  size: [number, number],
  color = colors.white,
  rotationY = 0,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.y = rotationY;
  parent.add(group);
  box(group, [size[0] + 0.18, size[1] + 0.18, 0.14], [0, 0, 0], colors.charcoal);
  return box(group, [size[0], size[1], 0.04], [0, 0, 0.09], color);
}

export function rug(
  parent: THREE.Object3D,
  position: [number, number, number],
  size: [number, number],
  colorsUsed: number[],
) {
  const group = new THREE.Group();
  group.position.set(...position);
  parent.add(group);
  box(group, [size[0], 0.04, size[1]], [0, 0, 0], colorsUsed[0]);
  colorsUsed.slice(1).forEach((color, index) => {
    box(group, [size[0] - 0.5 - index * 0.35, 0.015, 0.16], [0, 0.03, -size[1] / 3 + index * 0.5], color);
  });
  return group;
}

export function plant(parent: THREE.Object3D, position: [number, number, number]) {
  const group = new THREE.Group();
  group.position.set(...position);
  parent.add(group);
  cylinder(group, 0.38, 0.7, [0, 0.35, 0], colors.oxblood);
  for (let index = 0; index < 7; index += 1) {
    const leaf = box(group, [0.18, 1.1, 0.45], [0, 1.05, 0], colors.green);
    leaf.rotation.z = -0.55 + index * 0.18;
    leaf.rotation.y = index * 0.9;
  }
  return group;
}
