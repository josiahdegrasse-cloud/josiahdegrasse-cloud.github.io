import * as THREE from "three";
import {
  blocker,
  box,
  colors,
  cylinder,
  floor,
  material,
  rug,
  spotlight,
  wall,
  table,
} from "./game-kit";
import { addBedroomArtifacts, addBedroomContact, addBedroomPortals } from "./bedroom-hub";
import { sunsetSkyTexture } from "./world-rooftop";
import type { ChapterDefinition, ChapterId, ChapterResult, Collider, Portal, RoomProp } from "./game-types";

function goldenDuck(parent: THREE.Object3D, position: [number, number, number]) {
  const g = new THREE.Group();
  g.position.set(...position);
  parent.add(g);
  const gold = 0xf1c64a;
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), material(gold, { metalness: 0.4, roughness: 0.3 }));
  body.scale.set(1.3, 1, 1.1);
  body.position.y = 0.2;
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), material(gold, { metalness: 0.4, roughness: 0.3 }));
  head.position.set(0.16, 0.37, 0);
  g.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.13, 10), material(0xe8632a));
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.31, 0.35, 0);
  g.add(beak);
  return g;
}

function wallFlag(
  parent: THREE.Object3D,
  position: [number, number, number],
  size: [number, number],
  draw: (c: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, 512, 320);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const g = new THREE.Group();
  g.position.set(...position);
  parent.add(g);
  box(g, [size[0] + 0.14, size[1] + 0.14, 0.06], [0, 0, -0.02], colors.walnut); // frame
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(size[0], size[1]),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }),
  );
  flag.position.z = 0.03;
  g.add(flag);
  return g;
}

function drawAmericanFlag(c: CanvasRenderingContext2D, w: number, h: number) {
  const stripes = 13;
  for (let i = 0; i < stripes; i += 1) {
    c.fillStyle = i % 2 === 0 ? "#b22234" : "#ffffff";
    c.fillRect(0, (i * h) / stripes, w, h / stripes);
  }
  const cw = w * 0.4;
  const ch = (h * 7) / stripes;
  c.fillStyle = "#3c3b6e";
  c.fillRect(0, 0, cw, ch);
  c.fillStyle = "#ffffff";
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      c.beginPath();
      c.arc((cw * (col + 0.5)) / 6, (ch * (row + 0.5)) / 5, 5, 0, Math.PI * 2);
      c.fill();
    }
  }
}

function drawTuftsFlag(c: CanvasRenderingContext2D, w: number, h: number) {
  c.fillStyle = "#0a1f44"; // navy field
  c.fillRect(0, 0, w, h);
  c.fillStyle = "#6b4226"; // brown bar (Tufts brown + blue)
  c.fillRect(0, h * 0.74, w, h * 0.08);
  c.fillStyle = "#ffffff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = "900 130px Georgia, 'Times New Roman', serif";
  c.fillText("TUFTS", w / 2, h * 0.4);
  c.font = "600 38px Georgia, serif";
  c.fillText("UNIVERSITY", w / 2, h * 0.6);
}

function surfboard(
  parent: THREE.Object3D,
  position: [number, number, number],
  color: number,
  length: number,
  width: number,
  rotation: [number, number, number],
  stripeColor: number,
) {
  const shape = new THREE.Shape();
  shape.moveTo(0, -length / 2);
  shape.bezierCurveTo(width * 0.48, -length * 0.42, width * 0.55, length * 0.16, width * 0.34, length * 0.36);
  shape.quadraticCurveTo(width * 0.2, length * 0.48, 0, length / 2);
  shape.quadraticCurveTo(-width * 0.2, length * 0.48, -width * 0.34, length * 0.36);
  shape.bezierCurveTo(-width * 0.55, length * 0.16, -width * 0.48, -length * 0.42, 0, -length / 2);
  shape.closePath();
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.set(...rotation);
  parent.add(group);
  const board = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.04 }),
    material(color, { roughness: 0.28 }),
  );
  group.add(board);
  box(group, [0.07, length * 0.82, 0.025], [0, 0, 0.17], stripeColor);
  for (const x of [-0.16, 0.16]) {
    const fin = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.42, 3),
      material(colors.white, { roughness: 0.32 }),
    );
    fin.position.set(x, -length * 0.36, -0.12);
    fin.rotation.x = Math.PI / 2;
    group.add(fin);
  }
  return group;
}

function snowboard(
  parent: THREE.Object3D,
  position: [number, number, number],
  color: number,
  accent: number,
  rotation: [number, number, number],
) {
  const length = 3.85;
  const width = 0.86;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -length / 2 + 0.28);
  shape.quadraticCurveTo(-width / 2, -length / 2, 0, -length / 2);
  shape.quadraticCurveTo(width / 2, -length / 2, width / 2, -length / 2 + 0.28);
  shape.lineTo(width / 2, length / 2 - 0.28);
  shape.quadraticCurveTo(width / 2, length / 2, 0, length / 2);
  shape.quadraticCurveTo(-width / 2, length / 2, -width / 2, length / 2 - 0.28);
  shape.closePath();
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.set(...rotation);
  parent.add(group);
  const board = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.11, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.035 }),
    material(color, { roughness: 0.34 }),
  );
  group.add(board);
  for (const y of [-0.6, 0.6]) {
    const binding = new THREE.Group();
    binding.position.set(0, y, 0.18);
    binding.rotation.z = y < 0 ? -0.18 : 0.18;
    group.add(binding);
    box(binding, [0.56, 0.32, 0.17], [0, 0, 0], accent);
    box(binding, [0.49, 0.09, 0.32], [0, 0.08, 0.12], colors.ink);
  }
  box(group, [0.09, 2.9, 0.025], [0, 0, 0.16], accent);
  return group;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function paintingTexture(seed: number, background: string, accents: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 700;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const random = seededRandom(seed);
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 0.92;
  for (let index = 0; index < 9; index += 1) {
    const width = 100 + random() * 260;
    const height = 70 + random() * 210;
    context.fillStyle = accents[index % accents.length];
    context.save();
    context.translate(90 + random() * 720, 70 + random() * 560);
    context.rotate(-0.45 + random() * 0.9);
    context.fillRect(-width / 2, -height / 2, width, height);
    context.restore();
  }
  context.globalAlpha = 1;
  for (let index = 0; index < 7; index += 1) {
    context.strokeStyle = index % 2 ? "#17130f" : accents[(index + 2) % accents.length];
    context.lineWidth = index % 2 ? 11 : 6;
    context.beginPath();
    context.moveTo(80 + random() * 160, 80 + random() * 520);
    context.bezierCurveTo(
      300 + random() * 180,
      40 + random() * 620,
      520 + random() * 180,
      40 + random() * 620,
      700 + random() * 130,
      80 + random() * 520,
    );
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function expressionistCanvas(
  parent: THREE.Object3D,
  position: [number, number, number],
  seed: number,
  background: string,
  accents: string[],
  rotationY = 0,
) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.y = rotationY;
  parent.add(group);
  box(group, [2.85, 2.38, 0.14], [0, 0, 0], colors.walnut);
  const painting = new THREE.Mesh(
    new THREE.PlaneGeometry(2.64, 2.17),
    new THREE.MeshBasicMaterial({ map: paintingTexture(seed, background, accents) }),
  );
  painting.position.z = 0.09;
  group.add(painting);
}

function makeBed(parent: THREE.Object3D, z: number) {
  const bed = new THREE.Group();
  // Flush against the right wall, head toward the front.
  bed.position.set(3.0, 0, z + 3.55);
  parent.add(bed);
  const LINEN = 0xcabfa6;   // upholstered oatmeal frame
  const DUVET = 0xf3eee2;   // warm-white duvet
  const NAVY = 0x24446e;    // preppy navy shams (matches the gallery wall)
  const FUNK = 0x2f8f57;    // kelly-green throw — the twist of funk
  box(bed, [4.7, 0.72, 6.3], [0, 0.48, 0], LINEN, { roughness: 0.95 });
  box(bed, [4.45, 0.42, 5.95], [0, 1.02, -0.05], DUVET, { roughness: 0.9 });
  box(bed, [4.45, 0.18, 3.9], [0, 1.32, -0.75], DUVET, { roughness: 0.9 });
  // A folded kelly-green throw across the foot of the bed.
  const blanket = box(bed, [4.32, 0.15, 2.3], [0.02, 1.27, -1.45], FUNK, { roughness: 0.8 });
  blanket.rotation.z = -0.02;
  // Layered pillows: two white euros, two navy shams, and a green lumbar.
  for (const x of [-1.05, 1.05]) {
    const euro = box(bed, [1.75, 0.4, 1.2], [x, 1.42, 2.05], DUVET, { roughness: 0.9 });
    euro.rotation.y = x < 0 ? 0.08 : -0.08;
  }
  for (const x of [-1.0, 1.0]) {
    const sham = box(bed, [1.5, 0.3, 0.8], [x, 1.34, 1.35], NAVY, { roughness: 0.85 });
    sham.rotation.y = x < 0 ? 0.1 : -0.1;
  }
  box(bed, [2.1, 0.26, 0.6], [0, 1.32, 0.95], FUNK, { roughness: 0.8 }); // green lumbar
  box(bed, [4.8, 2.5, 0.28], [0, 1.7, 3.05], LINEN, { roughness: 0.95 }); // upholstered headboard
  const nightstand = table(bed, [-3.15, 0, 1.6], [1.25, 1.15], colors.walnut, colors.walnut);
  const lampBase = cylinder(nightstand, 0.14, 0.55, [0, 1.55, 0], 0xb9975b); // brass
  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 0.6, 20, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xf2cf7d, emissive: 0xf2a95e, emissiveIntensity: 0, side: THREE.DoubleSide }),
  );
  lampShade.position.set(0, 2.05, 0);
  nightstand.add(lampShade);
  const lampLight = new THREE.PointLight(0xffcf8a, 0, 6, 1.6);
  lampLight.position.set(0, 1.95, 0);
  nightstand.add(lampLight);
  void lampBase;
  return { bed, lampShade, lampLight };
}

function lowerTable(group: THREE.Group, height = 0.82) {
  const [top, ...legs] = group.children.filter((child) => child instanceof THREE.Mesh) as THREE.Mesh[];
  if (top) top.position.y = height;
  legs.slice(0, 4).forEach((leg) => {
    leg.scale.y = height / 1.2;
    leg.position.y = height / 2;
  });
}

function backgammonTable(parent: THREE.Object3D, z: number) {
  const game = table(parent, [-1.0, 0, z + 0.12], [2.5, 1.7], colors.walnut, colors.walnut);
  lowerTable(game, 0.82);
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#e8d7b1";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#332019";
    context.lineWidth = 24;
    context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
    context.fillStyle = "#5b321f";
    context.fillRect(492, 12, 40, 616);
    const pointWidth = 75;
    for (let quadrant = 0; quadrant < 2; quadrant += 1) {
      const startX = quadrant === 0 ? 38 : 548;
      for (let index = 0; index < 6; index += 1) {
        const x = startX + index * pointWidth;
        const topColor = index % 2 ? "#174f3a" : "#8b2427";
        const bottomColor = index % 2 ? "#8b2427" : "#174f3a";
        context.fillStyle = topColor;
        context.beginPath();
        context.moveTo(x, 28);
        context.lineTo(x + pointWidth - 8, 28);
        context.lineTo(x + pointWidth / 2 - 4, 286);
        context.closePath();
        context.fill();
        context.fillStyle = bottomColor;
        context.beginPath();
        context.moveTo(x, 612);
        context.lineTo(x + pointWidth - 8, 612);
        context.lineTo(x + pointWidth / 2 - 4, 354);
        context.closePath();
        context.fill();
      }
    }
  }
  const boardTexture = new THREE.CanvasTexture(canvas);
  boardTexture.colorSpace = THREE.SRGBColorSpace;
  boardTexture.anisotropy = 4;
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(2.78, 0.08, 1.7),
    [
      material(colors.walnut),
      material(colors.walnut),
      new THREE.MeshBasicMaterial({ map: boardTexture }),
      material(colors.walnut),
      material(colors.walnut),
      material(colors.walnut),
    ],
  );
  board.position.set(0, 0.91, 0);
  game.add(board);
  // Checkers sit on the 12 points (6 per half), stacking inward from each long edge.
  const checkerRadius = 0.12;
  const checkerHeight = 0.055;
  const pointX = [
    -1.185, -0.981, -0.778, -0.574, -0.371, -0.167,
    0.2, 0.403, 0.607, 0.81, 1.014, 1.217,
  ];
  const stackChecker = (point: number, edge: number, depth: number, color: number) =>
    cylinder(
      game,
      checkerRadius,
      checkerHeight,
      [pointX[point], 1.0, edge * (0.72 - depth * 0.2)],
      color,
      20,
    );
  // [pointIndex, edge (-1 top / +1 bottom), count, color] — a plausible mid-game spread, 15 a side.
  const layout: Array<[number, number, number, number]> = [
    [0, -1, 2, colors.ink], [3, -1, 2, colors.ink], [5, -1, 3, colors.ink],
    [7, 1, 4, colors.ink], [9, 1, 1, colors.ink], [11, 1, 3, colors.ink],
    [11, -1, 2, colors.white], [8, -1, 2, colors.white], [6, -1, 3, colors.white],
    [4, 1, 5, colors.white], [2, 1, 1, colors.white], [0, 1, 2, colors.white],
  ];
  for (const [point, edge, count, color] of layout) {
    for (let depth = 0; depth < count; depth += 1) stackChecker(point, edge, depth, color);
  }
  // Borne-off checkers stacked on the side tray.
  for (let depth = 0; depth < 3; depth += 1) {
    cylinder(game, checkerRadius, checkerHeight, [1.33, 1.0 + depth * 0.06, 0], colors.white, 20);
  }
  // Two dice and a doubling cube resting on the bar.
  const die = (x: number, rotation: number) => {
    const mesh = box(game, [0.12, 0.12, 0.12], [x, 1.02, 0.16], colors.white, { roughness: 0.4 });
    mesh.rotation.y = rotation;
    return mesh;
  };
  die(-0.02, 0.3);
  die(0.14, -0.5);
  const doublingCube = box(game, [0.18, 0.18, 0.18], [0, 1.05, -0.62], colors.yellow, { roughness: 0.45 });
  doublingCube.rotation.y = 0.4;
  // One checker mid-move drives the "finish the turn" interaction.
  const movingChecker = cylinder(game, checkerRadius, checkerHeight, [-0.62, 1.01, 0.26], colors.ink, 20);
  return { board, movingChecker };
}

function gable(parent: THREE.Object3D, z: number, facingFront = false, baseY = 6.5, color = 0xece6da, halfW = 7.35, peak = 4.6, frontZ = 10.8, backZ = 11) {
  const shape = new THREE.Shape();
  shape.moveTo(-halfW, 0);
  shape.lineTo(halfW, 0);
  shape.lineTo(0, peak);
  shape.closePath();
  const mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false }),
    material(color, { emissive: color, emissiveIntensity: 0.18 }),
  );
  mesh.position.set(0, baseY, facingFront ? z + frontZ : z - backZ);
  if (facingFront) mesh.rotation.y = Math.PI;
  parent.add(mesh);
}

export function buildBedroom(
  parent: THREE.Group,
  chapter: ChapterDefinition,
  completedRooms: Set<ChapterId> = new Set(),
): ChapterResult {
  const { z } = chapter;
  // Preppy-proper shell with a raised, airy A-frame: warm-white walls, a bold
  // navy "gallery" wall at the back, light natural-oak floor.
  // Cozier footprint (~half the old room): 11 x 13.5 instead of 15 x 22.
  const WALL_H = 8.4;
  const WALL_Y = 4.2;
  const HX = 5.4;   // half-width  (side walls at ±HX)
  const HZ = 6.75;  // half-length (end walls at z ±HZ)
  floor(parent, [11, 13.5], [0, -0.16, z], 0xb9a37e);                     // natural oak
  wall(parent, [13.5, WALL_H], [-HX, WALL_Y, z], 0xece6da, Math.PI / 2);  // warm white
  wall(parent, [13.5, WALL_H], [HX, WALL_Y, z], 0xece6da, Math.PI / 2);
  wall(parent, [11, WALL_H], [0, WALL_Y, z - HZ], 0x24446e);              // bold navy art wall
  wall(parent, [11, WALL_H], [0, WALL_Y, z + HZ], 0xece6da);
  gable(parent, z, false, 8.2, 0x24446e, HX, 3.7, 6.65, 6.85);  // navy gable over the art wall
  gable(parent, z, true, 8.2, 0xece6da, HX, 3.7, 6.65, 6.85);
  box(parent, [0.16, 0.55, 13.3], [-5.25, 0.28, z], colors.walnut);
  box(parent, [0.16, 0.55, 13.3], [5.25, 0.28, z], colors.walnut);
  box(parent, [10.5, 0.55, 0.16], [0, 0.28, z - 6.6], colors.walnut);
  box(parent, [10.5, 0.55, 0.16], [0, 0.28, z + 6.6], colors.walnut);
  const roofLeft = box(parent, [7.1, 0.3, 13.5], [-2.9, 8.2, z], 0xe7e0d2);
  roofLeft.rotation.z = 0.5;
  roofLeft.material.emissive.setHex(0xe7e0d2);
  roofLeft.material.emissiveIntensity = 0.22;
  roofLeft.userData.debugHide = true;
  const roofRight = box(parent, [7.1, 0.3, 13.5], [2.9, 8.2, z], 0xe7e0d2);
  roofRight.rotation.z = -0.5;
  roofRight.material.emissive.setHex(0xe7e0d2);
  roofRight.material.emissiveIntensity = 0.22;
  roofRight.userData.debugHide = true;
  box(parent, [0.55, 0.45, 13.5], [0, 10.3, z], colors.walnut).userData.debugHide = true; // ridge beam
  for (const x of [-4.0, 4.0]) {
    const beam = box(parent, [0.3, 9.2, 0.38], [x, 7.1, z], colors.walnut);
    beam.rotation.z = x < 0 ? -0.72 : 0.72;
  }

  // The door opens off the WEST (left) wall — freeing the back wall for art.
  const doorway = new THREE.Group();
  doorway.position.set(-5.28, 0, z - 1.7);
  doorway.rotation.y = Math.PI / 2;
  parent.add(doorway);
  box(doorway, [3.3, 0.45, 0.4], [0, 6.4, 0.05], colors.walnut); // lintel
  const leftDoor = box(doorway, [1.5, 6.3, 0.22], [-0.78, 3.15, 0.05], colors.tuftsBrown);
  const rightDoor = box(doorway, [1.5, 6.3, 0.22], [0.78, 3.15, 0.05], colors.tuftsBrown);
  box(leftDoor, [0.12, 0.42, 0.08], [0.56, 0, 0.16], 0xb9975b, { metalness: 0.65 });
  box(rightDoor, [0.12, 0.42, 0.08], [-0.56, 0, 0.16], 0xb9975b, { metalness: 0.65 });
  void rightDoor;

  const props: RoomProp[] = [];
  const portals: Portal[] = [];

  const windowFrame = new THREE.Group();
  windowFrame.position.set(-5.28, 3.2, z + 3.2);
  windowFrame.rotation.y = Math.PI / 2;
  parent.add(windowFrame);
  box(windowFrame, [5.4, 4.6, 0.12], [0, 0, 0], colors.walnut);
  // The glass shows the same golden-hour sky as the rooftop — and you can climb
  // out through it to escape onto the roof.
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(4.85, 4.1),
    new THREE.MeshBasicMaterial({ map: sunsetSkyTexture() }),
  );
  windowGlass.position.set(0, 0, 0.08);
  windowFrame.add(windowGlass);
  box(windowFrame, [0.14, 4.1, 0.06], [0, 0, 0.12], colors.walnut);   // mullion
  box(windowFrame, [4.85, 0.14, 0.06], [0, 0, 0.12], colors.walnut);  // transom
  portals.push({
    id: "portal-window",
    target: "rooftop",
    title: "The yard outside",
    prompt: "Climb out the window",
    position: new THREE.Vector3(-4.55, 3.55, z + 3.2),
    object: windowGlass,
    minFeetY: 0.42,
  });
  props.push({
    id: "prop-window",
    object: windowGlass,
    prompt: "Open the window",
    position: new THREE.Vector3(-4.55, 2.4, z + 3.2),
    detail: "Window open. Climb onto the bench, then step through.",
  });

  const bedParts = makeBed(parent, z);
  props.push({
    id: "prop-lamp",
    object: bedParts.lampShade,
    prompt: "Turn on the lamp",
    position: new THREE.Vector3(-0.5, 1.7, z + 5.0),
    toggle: (on) => {
      bedParts.lampLight.intensity = on ? 16 : 0;
      (bedParts.lampShade.material as THREE.MeshStandardMaterial).emissiveIntensity = on ? 0.95 : 0;
    },
    detail: "Click again to switch it off.",
  });
  props.push({
    id: "prop-bed",
    object: bedParts.bed,
    prompt: "Flop onto the bed",
    position: new THREE.Vector3(3.0, 1.2, z + 3.55),
    detail: "Comfy. (Jump on it to bounce.)",
    quiet: true,
  });
  const rugGroup = rug(parent, [-0.5, 0.01, z + 0.7], [4.7, 3.5], [0xf3eee2, 0x24446e, 0x2f8f57, 0xd9a441]);
  props.push({
    id: "prop-rug",
    object: rugGroup,
    prompt: "Straighten the rug",
    position: new THREE.Vector3(-0.5, 0.2, z + 0.7),
    detail: "Tidied.",
    quiet: true,
  });
  const game = backgammonTable(parent, z);
  props.push({
    id: "prop-backgammon",
    object: game.board,
    prompt: "Set up the backgammon board",
    position: new THREE.Vector3(-1.0, 1.0, z + 0.12),
    detail: "Your move.",
  });

  // A low listening credenza anchors the music corner without blocking the room.
  const credenza = box(parent, [3.4, 0.9, 1.3], [-3.4, 0.45, z - 4.1], colors.walnut);
  box(parent, [3.55, 0.14, 1.45], [-3.4, 0.96, z - 4.1], colors.ink);
  for (let index = 0; index < 11; index += 1) {
    box(parent, [0.06, 0.62, 0.9], [-4.5 + index * 0.22, 0.56, z - 4.1], [colors.red, colors.yellow, colors.blue, colors.pink][index % 4]);
  }
  props.push({
    id: "prop-credenza",
    object: credenza,
    prompt: "Flip through the records",
    position: new THREE.Vector3(-3.4, 0.9, z - 3.3),
    detail: "A good crate.",
  });

  // One quiet window bench under the window.
  const bench = box(parent, [1.1, 0.72, 3.0], [-4.82, 0.38, z + 3.5], colors.tuftsBrown);
  box(parent, [0.95, 0.28, 2.75], [-4.76, 0.88, z + 3.5], colors.powder);
  box(parent, [0.82, 0.22, 2.55], [-5.08, 1.24, z + 3.5], colors.walnut);
  box(parent, [0.2, 0.9, 0.9], [-4.66, 1.16, z + 2.5], colors.oxblood);
  box(parent, [0.2, 0.9, 0.9], [-4.66, 1.16, z + 4.5], colors.green);
  props.push({
    id: "prop-bench",
    object: bench,
    prompt: "Sit on the window bench",
    position: new THREE.Vector3(-4.4, 0.8, z + 3.5),
    detail: "A nice spot to read.",
  });

  // SPORTS ZONE: gear leans in the front-left corner — clear of the bed and
  // pickup-able so you can move it anywhere.
  const boards = [
    surfboard(parent, [-3.9, 2.1, z + 6.2], 0xf3d86c, 3.6, 0.74, [0, Math.PI, 0.06], colors.red),
    surfboard(parent, [-3.1, 2.0, z + 6.25], colors.red, 3.25, 0.66, [0, Math.PI, 0.1], colors.white),
    snowboard(parent, [-2.3, 2.1, z + 6.2], colors.tuftsBlue, colors.white, [0, Math.PI, -0.06]),
    snowboard(parent, [-1.5, 2.0, z + 6.25], colors.ink, colors.yellow, [0, Math.PI, -0.1]),
  ];
  const slopeBoard = boards[2]; // this one launches the hidden snowboard run
  boards.forEach((object, index) => {
    if (index === 2) return;
    props.push({
      id: `prop-board-${index}`,
      object,
      prompt: "Pick up the board",
      position: object.position.clone(),
      grabbable: true,
    });
  });
  // Bold, funky gallery art tied to the room's accent colors (navy / green / gold / coral).
  expressionistCanvas(parent, [-2.6, 4.1, z - 6.5], 17, "#f3eee2", ["#24446e", "#2f8f57", "#e0a32e", "#d8503b"]);
  expressionistCanvas(parent, [2.6, 4.1, z - 6.5], 31, "#f3eee2", ["#d8503b", "#2f8f57", "#24446e", "#e0a32e"]);

  // A classy Tufts banner and the Stars and Stripes, mounted high on the front
  // (entry) wall above the gear.
  const usFlag = wallFlag(parent, [-2.7, 5.1, z + 6.55], [1.7, 1.06], drawAmericanFlag);
  usFlag.rotation.y = Math.PI;
  const tuftsFlag = wallFlag(parent, [2.7, 5.1, z + 6.55], [1.7, 1.06], drawTuftsFlag);
  tuftsFlag.rotation.y = Math.PI;

  // Three tiny NCAA lacrosse trophies, displayed over the bed with the center
  // title raised on a riser — a nod to the championship years.
  const trophyShelf = new THREE.Group();
  trophyShelf.position.set(5.22, 2.65, z + 2.6);
  trophyShelf.rotation.y = -Math.PI / 2; // mounted on the right wall
  parent.add(trophyShelf);
  box(trophyShelf, [2.1, 0.09, 0.36], [0, 0, 0], colors.walnut);
  [-0.66, 0, 0.66].forEach((tx, i) => {
    const gold = 0xd9a441;
    const riser = i === 1 ? 0.24 : 0; // center trophy stands tallest
    if (riser) box(trophyShelf, [0.36, riser, 0.3], [tx, riser / 2 + 0.045, 0], colors.ink);
    const baseY = 0.06 + riser;
    cylinder(trophyShelf, 0.11, 0.05, [tx, baseY, 0], colors.ink, 14);
    cylinder(trophyShelf, 0.022, 0.12, [tx, baseY + 0.09, 0], gold, 10);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.05, 0.14, 16), material(gold, { metalness: 0.55, roughness: 0.3 }));
    cup.position.set(tx, baseY + 0.22, 0);
    trophyShelf.add(cup);
    for (const sx of [-1, 1]) {
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 10, Math.PI), material(gold, { metalness: 0.5, roughness: 0.35 }));
      handle.position.set(tx + sx * 0.1, baseY + 0.22, 0);
      handle.rotation.z = sx < 0 ? -Math.PI / 2 : Math.PI / 2;
      trophyShelf.add(handle);
    }
  });
  // Trophies are quiet decor now — no caption.

  // ── Hidden parkour: a living green wall in the back-right corner. The leafy
  // planter ledges look like decor — only a curious explorer realizes they're a
  // climb up to the secret way outside.
  const parkourColliders: Collider[] = [];
  const leafGreens = [0x4f9a47, 0x3f7d39, 0x5aa84e, 0x46863e];
  const ledge = (x: number, top: number, zz: number, w = 0.85, d = 0.7) => {
    box(parent, [w, 0.1, d], [x, top - 0.05, zz], 0x6b4a2b); // wooden planter ledge
    for (let i = 0; i < 3; i += 1) {
      const blob = new THREE.Mesh(new THREE.SphereGeometry(0.16 + Math.random() * 0.1, 8, 6), material(leafGreens[i % leafGreens.length], { roughness: 1 }));
      blob.position.set(x + (Math.random() - 0.5) * w * 0.7, top + 0.06, zz + (Math.random() - 0.5) * d * 0.4);
      parent.add(blob);
    }
    cylinder(parent, 0.018, 0.4 + Math.random() * 0.25, [x + (Math.random() - 0.5) * w * 0.5, top - 0.28, zz + d * 0.3], 0x3f7d39, 5); // trailing vine
    parkourColliders.push({ ...blocker(x, zz, w / 2, d / 2), top });
  };
  ledge(3.7, 0.8, z - 5.2, 1.6, 1.35);
  ledge(4.4, 1.5, z - 5.55, 1.5, 1.2);
  ledge(3.6, 2.2, z - 5.55, 1.6, 1.3);
  ledge(4.4, 2.9, z - 5.5, 1.5, 1.2);
  ledge(3.8, 3.6, z - 5.4, 1.9, 1.6); // big leafy landing at the top
  // Climbing vines on the corner wall tie the whole thing together.
  for (const vx of [4.95, 4.55, 3.2]) {
    for (let s = 0; s < 7; s += 1) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 5), material(leafGreens[s % leafGreens.length], { roughness: 1 }));
      leaf.position.set(vx + Math.sin(s * 1.3) * 0.12, 0.5 + s * 0.62, z - 5.7);
      parent.add(leaf);
    }
  }
  // A hidden dormer at the top of the climb — slip through to the rooftop.
  box(parent, [0.14, 1.9, 2.0], [5.32, 4.2, z - 5.4], colors.walnut); // dormer frame
  const dormer = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.5),
    new THREE.MeshBasicMaterial({ map: sunsetSkyTexture() }),
  );
  dormer.position.set(5.24, 4.2, z - 5.4);
  dormer.rotation.y = -Math.PI / 2;
  parent.add(dormer);
  portals.push({
    id: "portal-skylight",
    target: "rooftop",
    title: "Outside",
    prompt: "Climb out into the open",
    position: new THREE.Vector3(4.4, 4.0, z - 5.4),
    object: dormer,
  });

  // Easter egg #2: a second little duck hiding behind the record credenza.
  const hiddenDuck = goldenDuck(parent, [-5.05, 0.0, z - 4.1]);
  hiddenDuck.scale.setScalar(0.7);
  props.push({
    id: "prop-hidden-duck",
    object: hiddenDuck,
    prompt: "A duck?",
    position: new THREE.Vector3(-4.8, 0.3, z - 4.1),
    detail: "There's always a second duck.",
  });

  const morning = new THREE.PointLight(0xffd9a8, 28, 13, 1.5);
  morning.position.set(-4.6, 4.2, z + 3.2);
  parent.add(morning);
  spotlight(parent, 0xfff1dc, [-4.3, 7.8, z + 2.8], [-0.8, 0.4, z + 0.6], 70);
  spotlight(parent, 0xfff1dc, [2.8, 7.9, z - 3.6], [2.8, 1, z - 4.2], 48);
  spotlight(parent, 0xfff4e6, [0, 7.6, z - 5.8], [0, 3.4, z - 6.5], 44); // washes the navy art wall

  addBedroomArtifacts(parent, z, completedRooms);
  const keepsakes = (() => {
    try {
      return JSON.parse(localStorage.getItem("josiah-portfolio-keepsakes") ?? "[]") as string[];
    } catch {
      return [] as string[];
    }
  })();
  if (keepsakes.length > 0) {
    box(parent, [4.2, 0.14, 0.5], [2.7, 1.15, z - 6.45], colors.walnut);
    keepsakes.forEach((id, index) => {
      const x = 1.5 + index * .82;
      if (id === "snow-line") {
        const line = box(parent, [.62, .08, .22], [x, 1.45, z - 6.4], colors.tuftsBlue, {
          emissive: colors.powder,
          emissiveIntensity: .35,
        });
        line.rotation.z = -.12;
      } else if (id === "table-crown") {
        cylinder(parent, .23, .1, [x, 1.45, z - 6.4], colors.ink, 20);
        cylinder(parent, .12, .12, [x, 1.51, z - 6.38], colors.yellow, 12);
      } else if (id === "off-menu-record") {
        const record = cylinder(parent, .23, .05, [x, 1.48, z - 6.4], colors.ink, 24);
        record.rotation.x = Math.PI / 2;
        cylinder(parent, .06, .06, [x, 1.48, z - 6.36], colors.pink, 12).rotation.x = Math.PI / 2;
      }
    });
  }
  const hub = addBedroomPortals(parent, z, leftDoor);
  const contact = addBedroomContact(parent, z);

  let checkerProgress = 0;

  return {
    entry: [-1.0, 1.72, z + 2.4],
    bounds: { minX: -4.95, maxX: 4.95, minZ: z - 6.2, maxZ: z + 6.2 },
    portals: [...hub.portals, ...portals],
    // Every piece of furniture is a low platform you can jump onto and stand on
    // (top = its surface height); the bed also bounces.
    colliders: [
      { ...blocker(3.0, z + 3.55, 2.0, 2.8), top: 1.0, bounce: true }, // bed
      { ...blocker(-1.0, z + 0.12, 1.3, 0.95), top: 0.82 },           // backgammon table
      { ...blocker(-3.4, z - 4.1, 1.8, 0.8), top: 0.9 },              // listening credenza
      { ...blocker(-4.82, z + 3.5, 0.7, 1.7), top: 0.66 },            // window bench
      ...parkourColliders,
      ...hub.colliders,
      ...contact.colliders,
    ],
    props,
    animated: [
      (_elapsed, delta) => {
        if (checkerProgress > 0 && checkerProgress < 1) checkerProgress = Math.min(1, checkerProgress + delta * 0.7);
        game.movingChecker.position.x = THREE.MathUtils.lerp(-0.62, 0.28, checkerProgress);
        game.movingChecker.position.z = THREE.MathUtils.lerp(0.26, -0.42, checkerProgress);
        game.movingChecker.position.y = 1.01 + Math.sin(checkerProgress * Math.PI) * 0.4;
      },
    ],
    // The hub's interactions are the six portals, the contact console, and the hidden snowboard
    // run; the coffee/backgammon/lacrosse rituals remain ambient so the room feels lived-in.
    steps: [
      ...contact.steps,
      {
        id: "bedroom-snowboard",
        chapter: "recovery",
        order: 9,
        title: "Snowboard",
        prompt: "Grab the snowboard 🏂",
        objective: "Take a hidden run",
        detail: "",
        position: new THREE.Vector3(1.7, 1.9, z + 9.6),
        object: slopeBoard,
        minigame: "snowboard",
      },
      {
        id: "bedroom-backgammon",
        chapter: "recovery",
        order: 10,
        title: "Backgammon",
        prompt: "Play backgammon vs the AI 🎲",
        objective: "Beat the bot",
        detail: "",
        position: new THREE.Vector3(-1.35, 1.5, z + 0.2),
        object: game.board,
        minigame: "backgammon",
      },
    ],
  };
}
