import * as THREE from "three";
import { blocker, box, colors, cylinder, material } from "./game-kit";
import type { ChapterDefinition, ChapterId, ChapterResult, Portal, RoomProp } from "./game-types";

/**
 * A golden-hour sky gradient, shared by this outdoor world's skydome and the
 * bedroom window so the "outside" matches in both places.
 */
export function sunsetSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 256;
  const c = canvas.getContext("2d");
  if (c) {
    const g = c.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#2a4a86");
    g.addColorStop(0.4, "#7f7ab0");
    g.addColorStop(0.66, "#e69b6a");
    g.addColorStop(0.85, "#f6c277");
    g.addColorStop(1, "#fbe6b0");
    c.fillStyle = g;
    c.fillRect(0, 0, 16, 256);
  }
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function tree(parent: THREE.Object3D, x: number, zz: number, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, zz);
  g.scale.setScalar(scale);
  parent.add(g);
  cylinder(g, 0.2, 2.4, [0, 1.2, 0], 0x6b4a2b, 8);
  const greens = [0x3f7d39, 0x4f9a47, 0x356b32, 0x5aa84e];
  for (let i = 0; i < 5; i += 1) {
    const blob = new THREE.Mesh(
      new THREE.SphereGeometry(0.85 + Math.random() * 0.35, 10, 8),
      material(greens[i % greens.length], { roughness: 0.95 }),
    );
    blob.position.set((Math.random() - 0.5) * 1.1, 2.5 + Math.random() * 1.1, (Math.random() - 0.5) * 1.1);
    g.add(blob);
  }
  return g;
}

function bush(parent: THREE.Object3D, x: number, zz: number) {
  const g = new THREE.Group();
  g.position.set(x, 0, zz);
  parent.add(g);
  for (let i = 0; i < 3; i += 1) {
    const blob = new THREE.Mesh(new THREE.SphereGeometry(0.42 + Math.random() * 0.2, 9, 7), material(0x46863e, { roughness: 1 }));
    blob.position.set((Math.random() - 0.5) * 0.7, 0.32 + Math.random() * 0.15, (Math.random() - 0.5) * 0.7);
    g.add(blob);
  }
}

function flower(parent: THREE.Object3D, x: number, zz: number, color: number) {
  cylinder(parent, 0.02, 0.3, [x, 0.15, zz], 0x3f7d39, 5);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), material(color, { roughness: 0.7 }));
  head.position.set(x, 0.33, zz);
  parent.add(head);
}

function steppingStone(parent: THREE.Object3D, x: number, zz: number, radius = 0.5) {
  const stone = new THREE.Mesh(new THREE.CircleGeometry(radius, 8), material(0x9a8f7a, { roughness: 1 }));
  stone.rotation.x = -Math.PI / 2;
  stone.position.set(x, 0.03, zz);
  parent.add(stone);
  return stone;
}

function pathStone(parent: THREE.Object3D, x: number, zz: number, radius = 0.42) {
  const stone = steppingStone(parent, x, zz, radius);
  stone.scale.x = 1.25;
  stone.rotation.z = (x + zz) * 0.08;
  return stone;
}

function fence(parent: THREE.Object3D, x: number, z: number, length: number, rotation = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotation;
  parent.add(g);
  for (let i = -length / 2; i <= length / 2; i += 1.4) {
    cylinder(g, 0.045, 0.92, [i, 0.46, 0], colors.walnut, 7);
  }
  box(g, [length, 0.08, 0.08], [0, 0.72, 0], colors.walnut);
  box(g, [length, 0.07, 0.07], [0, 0.38, 0], colors.walnut);
  return g;
}

function pine(parent: THREE.Object3D, x: number, z: number, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(scale);
  parent.add(g);
  cylinder(g, 0.16, 2.4, [0, 1.2, 0], 0x5e3f25, 8);
  for (let i = 0; i < 4; i += 1) {
    const needles = new THREE.Mesh(
      new THREE.ConeGeometry(0.95 - i * 0.12, 1.55, 9),
      material([0x245a37, 0x2e6a3e, 0x1f4d32][i % 3], { roughness: 0.96 }),
    );
    needles.position.y = 2.0 + i * 0.72;
    g.add(needles);
  }
  return g;
}

function trailArrow(parent: THREE.Object3D, text: string, x: number, z: number, rotation = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotation;
  parent.add(g);
  cylinder(g, 0.055, 1.35, [0, 0.68, 0], colors.walnut, 8);
  const board = box(g, [1.45, 0.36, 0.1], [0, 1.32, 0], colors.walnut);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#5b321f";
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = "#fff9e9";
    ctx.font = "900 38px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), 256, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.28), new THREE.MeshBasicMaterial({ map: texture }));
  face.position.set(0, 1.32, -0.06);
  g.add(face);
  return board;
}

function duck(parent: THREE.Object3D, position: [number, number, number]) {
  const g = new THREE.Group();
  g.position.set(...position);
  parent.add(g);
  const gold = 0xf1c64a;
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), material(gold, { metalness: 0.3, roughness: 0.4 }));
  body.scale.set(1.3, 1, 1.1);
  body.position.y = 0.16;
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), material(gold, { metalness: 0.3, roughness: 0.4 }));
  head.position.set(0.16, 0.33, 0);
  g.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.13, 10), material(0xe8632a));
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.31, 0.31, 0);
  g.add(beak);
  return g;
}

function bird(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), material(0x17130f, { roughness: 0.8 }));
  body.scale.set(1.25, 0.75, 0.8);
  g.add(body);
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 6), material(0x17130f, { roughness: 0.8 }));
    wing.position.x = side * 0.12;
    wing.rotation.z = side * 1.35;
    g.add(wing);
  }
  return g;
}

function buildCar(parent: THREE.Object3D) {
  const car = new THREE.Group();
  car.position.set(4.6, 0, -0.4);
  car.rotation.y = Math.PI / 2;
  parent.add(car);

  const body = box(car, [2.2, 0.58, 1.18], [0, 0.58, 0], 0xd82f24, { roughness: 0.38, metalness: 0.18 });
  box(car, [1.18, 0.55, 0.92], [-0.18, 1.02, -0.02], 0xfff9e9, { roughness: 0.18, metalness: 0.05 });
  box(car, [0.62, 0.34, 0.96], [-0.18, 1.06, 0], 0x91c8ed, { transparent: true, opacity: 0.72, roughness: 0.12 });
  box(car, [0.48, 0.12, 0.44], [0.86, 0.84, -0.64], 0xfff1b5, { emissive: 0xffd681, emissiveIntensity: 0.4 });
  box(car, [0.48, 0.12, 0.44], [0.86, 0.84, 0.64], 0xfff1b5, { emissive: 0xffd681, emissiveIntensity: 0.4 });
  box(car, [0.16, 0.16, 1.24], [-1.15, 0.64, 0], colors.chrome, { metalness: 0.7, roughness: 0.26 });
  box(car, [1.0, 0.12, 0.34], [-0.18, 1.43, 0], colors.walnut);
  const board = box(car, [1.48, 0.08, 0.22], [-0.18, 1.56, 0], colors.yellow);
  board.rotation.z = 0.06;

  const wheels: THREE.Mesh[] = [];
  for (const x of [-0.72, 0.72]) {
    for (const z of [-0.66, 0.66]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.18, 18),
        material(colors.ink, { roughness: 0.5, metalness: 0.15 }),
      );
      wheel.position.set(x, 0.28, z);
      wheel.rotation.x = Math.PI / 2;
      car.add(wheel);
      wheels.push(wheel);
      cylinder(car, 0.12, 0.2, [x, 0.28, z], colors.chrome, 14).rotation.x = Math.PI / 2;
    }
  }

  const exhaust = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
  exhaust.position.set(-1.28, 0.5, 0);
  car.add(exhaust);

  return { car, body, wheels, exhaust };
}

export function buildRooftop(
  parent: THREE.Group,
  _chapter: ChapterDefinition,
  _completed: Set<ChapterId> = new Set(),
): ChapterResult {
  const props: RoomProp[] = [];

  // Sky + low golden sun.
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(90, 28, 18),
    new THREE.MeshBasicMaterial({ map: sunsetSkyTexture(), side: THREE.BackSide, fog: false }),
  );
  parent.add(sky);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffe7ad, fog: false }));
  sun.position.set(-30, 9, -52);
  parent.add(sun);
  const sunGlow = new THREE.PointLight(0xffd2a0, 70, 160, 1.3);
  sunGlow.position.set(-22, 12, -34);
  parent.add(sunGlow);

  // Rolling grass ground: expanded into readable zones instead of visual confetti.
  box(parent, [120, 0.5, 120], [0, -0.25, -18], 0x5d9a4f);
  for (let i = 0; i < 34; i += 1) {
    const patch = new THREE.Mesh(new THREE.CircleGeometry(1.5 + Math.random() * 2.2, 10), material([0x6fae5b, 0x4f8a44, 0x67a653][i % 3], { roughness: 1 }));
    patch.rotation.x = -Math.PI / 2;
    patch.position.set((Math.random() - 0.5) * 48, 0.02, (Math.random() - 0.5) * 62 - 16);
    parent.add(patch);
  }

  // Distant rolling hills + blue mountains for depth.
  for (let i = 0; i < 6; i += 1) {
    const hill = new THREE.Mesh(new THREE.SphereGeometry(7 + Math.random() * 5, 14, 10), material([0x4a8a45, 0x3f7d3c][i % 2], { roughness: 1, fog: true }));
    hill.scale.y = 0.4;
    hill.position.set(-27 + i * 11, -3, -29 - (i % 2) * 6);
    parent.add(hill);
  }
  for (let i = 0; i < 7; i += 1) {
    const mtn = new THREE.Mesh(new THREE.ConeGeometry(6 + (i % 3), 11 + (i % 2) * 3, 6), material([0x6a7fa0, 0x59708f, 0x7189ad][i % 3], { roughness: 1 }));
    mtn.position.set(-37 + i * 12, 2.5, -44 - (i % 2) * 5);
    parent.add(mtn);
    const snow = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 6), material(0xf2f5f1, { roughness: 0.9 }));
    snow.position.set(mtn.position.x, 8.2 + (i % 2) * 1.3, mtn.position.z);
    parent.add(snow);
  }

  // Funny-continuous road, now long enough to actually drive and read as a route.
  const road = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 70), material(0x756c61, { roughness: 1 }));
  road.rotation.x = -Math.PI / 2;
  road.rotation.z = -0.1;
  road.position.set(4.8, 0.025, -32.2);
  parent.add(road);
  for (let i = 0; i < 27; i += 1) {
    const stripe = box(parent, [0.16, 0.03, 1.0], [4.8 + Math.sin(i * 0.5) * 0.28, 0.06, -1.2 - i * 2.4], colors.yellow, {
      emissive: colors.yellow,
      emissiveIntensity: 0.12,
    });
    stripe.rotation.y = -0.1;
  }
  fence(parent, -2.2, -0.8, 5.4, 0.05);
  fence(parent, 9.0, -5.8, 7.6, 1.42);
  fence(parent, 9.6, -20.5, 9.4, 1.5);

  // Quiet yard landmarks so the outside reads like a real place: driveway, mail,
  // trailhead, and a small picnic spot.
  const mailbox = new THREE.Group();
  mailbox.position.set(1.9, 0, -1.0);
  mailbox.rotation.y = -0.15;
  parent.add(mailbox);
  cylinder(mailbox, 0.06, 1.0, [0, 0.5, 0], colors.walnut, 8);
  const mailBody = box(mailbox, [0.7, 0.38, 0.42], [0.12, 1.02, 0], 0x24446e, { roughness: 0.45 });
  box(mailbox, [0.36, 0.05, 0.24], [0.14, 1.03, -0.25], colors.white);
  props.push({
    id: "rooftop-mailbox",
    object: mailBody,
    prompt: "Check the mailbox",
    position: new THREE.Vector3(1.9, 1.0, -1.0),
    detail: "One postcard. It says: the mountains are closer than they look.",
  });

  const trailSign = new THREE.Group();
  trailSign.position.set(-4.4, 0, -7.3);
  trailSign.rotation.y = 0.32;
  parent.add(trailSign);
  cylinder(trailSign, 0.06, 1.7, [0, 0.85, 0], colors.walnut, 8);
  const trailBoard = box(trailSign, [1.8, 0.46, 0.1], [0, 1.52, 0], colors.walnut);
  box(trailSign, [1.45, 0.09, 0.12], [0.04, 1.58, -0.08], colors.yellow, { emissive: colors.yellow, emissiveIntensity: 0.08 });
  box(trailSign, [0.7, 0.07, 0.12], [-0.32, 1.43, -0.08], colors.white);
  props.push({
    id: "rooftop-trail-sign",
    object: trailBoard,
    prompt: "Read the trail sign",
    position: new THREE.Vector3(-4.4, 1.35, -7.3),
    detail: "Pond Loop, Window Route, Mountain Road. Somehow all three start here.",
  });
  trailArrow(parent, "pond loop", -1.2, -4.2, 0.45);
  trailArrow(parent, "garden", -7.5, 1.2, -0.7);
  trailArrow(parent, "mountain road", 7.6, -12.2, -0.12);

  const picnic = new THREE.Group();
  picnic.position.set(-3.0, 0, 1.8);
  picnic.rotation.y = -0.36;
  parent.add(picnic);
  const blanket = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.45), material(0xf3eee2, { roughness: 1 }));
  blanket.rotation.x = -Math.PI / 2;
  blanket.position.y = 0.045;
  picnic.add(blanket);
  box(picnic, [0.46, 0.34, 0.38], [-0.58, 0.2, 0.1], colors.red);
  box(picnic, [0.5, 0.08, 0.42], [-0.58, 0.4, 0.1], colors.white);
  cylinder(picnic, 0.13, 0.12, [0.28, 0.1, -0.18], colors.yellow, 16);
  const picnicBook = box(picnic, [0.62, 0.04, 0.42], [0.42, 0.08, 0.28], colors.green);
  props.push({
    id: "rooftop-picnic",
    object: picnicBook,
    prompt: "Open the picnic notebook",
    position: new THREE.Vector3(-2.6, 0.45, 2.0),
    detail: "A sketch of the bedroom window, then a list: calmer, slower, better.",
  });

  // The yard now has a few quiet destinations with clear paths between them.
  for (let i = 0; i < 10; i += 1) pathStone(parent, -1.6 - i * 0.72, 1.1 - i * 0.85, 0.34);
  for (let i = 0; i < 12; i += 1) pathStone(parent, -4.7 + Math.sin(i * 0.55) * 0.55, -7.4 - i * 1.45, 0.31);
  for (let i = 0; i < 14; i += 1) pathStone(parent, 1.6 + i * 0.35, -4.5 - i * 2.6, 0.3);

  const garden = new THREE.Group();
  garden.position.set(-10.5, 0, 0.4);
  garden.rotation.y = -0.18;
  parent.add(garden);
  fence(garden, 0, 0, 5.6, 0);
  fence(garden, 0, -3.4, 5.6, 0);
  fence(garden, -2.8, -1.7, 3.4, Math.PI / 2);
  fence(garden, 2.8, -1.7, 3.4, Math.PI / 2);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const mound = new THREE.Mesh(new THREE.CircleGeometry(0.22, 8), material(0x4f8a44, { roughness: 1 }));
      mound.rotation.x = -Math.PI / 2;
      mound.position.set(-1.6 + col * 0.8, 0.04, -0.9 - row * 0.72);
      garden.add(mound);
      cylinder(garden, 0.018, 0.32, [-1.6 + col * 0.8, 0.2, -0.9 - row * 0.72], 0x2f6f39, 5);
    }
  }
  const pump = cylinder(garden, 0.11, 0.9, [2.05, 0.45, -2.65], colors.chrome, 10);
  box(garden, [0.56, 0.12, 0.12], [2.22, 0.92, -2.65], colors.chrome, { metalness: 0.7 });
  props.push({
    id: "rooftop-garden",
    object: pump,
    prompt: "Prime the garden pump",
    position: new THREE.Vector3(-8.45, 0.9, -2.25),
    detail: "A quiet little system: water, soil, patience.",
  });

  const shed = new THREE.Group();
  shed.position.set(-14.0, 0, -5.0);
  shed.rotation.y = 0.32;
  parent.add(shed);
  box(shed, [2.6, 2.0, 2.0], [0, 1.0, 0], 0x8a5a3a);
  const shedRoofL = box(shed, [1.8, 0.2, 2.25], [-0.72, 2.16, 0], 0x24446e);
  shedRoofL.rotation.z = 0.5;
  const shedRoofR = box(shed, [1.8, 0.2, 2.25], [0.72, 2.16, 0], 0x24446e);
  shedRoofR.rotation.z = -0.5;
  const shedDoor = box(shed, [0.85, 1.35, 0.12], [0.0, 0.76, -1.05], colors.walnut);
  box(shed, [0.48, 0.08, 0.08], [1.0, 1.3, -1.1], colors.yellow, { emissive: colors.yellow, emissiveIntensity: 0.16 });
  props.push({
    id: "rooftop-shed",
    object: shedDoor,
    prompt: "Peek in the shed",
    position: new THREE.Vector3(-14.0, 1.0, -5.9),
    detail: "Rakes, a bike pump, and one suspiciously well-labeled box: EXTRA CONTEXT.",
  });

  const dock = new THREE.Group();
  dock.position.set(-3.7, 0, -2.7);
  dock.rotation.y = 0.18;
  parent.add(dock);
  for (let i = 0; i < 5; i += 1) box(dock, [0.18, 0.12, 1.8], [-0.8 + i * 0.4, 0.13, 0], colors.walnut);
  for (const x of [-1.05, 1.05]) cylinder(dock, 0.055, 0.8, [x, 0.4, -0.75], colors.walnut, 8);
  const tackle = box(dock, [0.5, 0.32, 0.38], [0.55, 0.35, 0.55], colors.red);
  props.push({
    id: "rooftop-dock",
    object: tackle,
    prompt: "Open the tackle box",
    position: new THREE.Vector3(-3.15, 0.55, -2.1),
    detail: "Hooks, string, and a note: every good system needs a place to sit and untangle.",
  });

  const canoe = new THREE.Group();
  canoe.position.set(-4.8, 0.05, -2.0);
  canoe.rotation.y = -0.75;
  parent.add(canoe);
  const hull = box(canoe, [1.8, 0.24, 0.52], [0, 0.16, 0], colors.green);
  hull.scale.z = 0.72;
  box(canoe, [1.55, 0.07, 0.08], [0, 0.34, 0], colors.walnut);
  props.push({
    id: "rooftop-canoe",
    object: hull,
    prompt: "Inspect the canoe",
    position: new THREE.Vector3(-4.8, 0.45, -2.0),
    detail: "Technically pond-sized. Emotionally expedition-sized.",
  });

  const overlook = new THREE.Group();
  overlook.position.set(4.8, 0, -51.0);
  parent.add(overlook);
  const turnout = new THREE.Mesh(new THREE.CircleGeometry(5.0, 24), material(0x8f8576, { roughness: 1 }));
  turnout.rotation.x = -Math.PI / 2;
  turnout.position.y = 0.055;
  overlook.add(turnout);
  fence(overlook, 0, -3.8, 7.4, 0);
  fence(overlook, -4.1, -0.7, 4.6, Math.PI / 2);
  fence(overlook, 4.1, -0.7, 4.6, Math.PI / 2);
  const scopeStand = cylinder(overlook, 0.08, 1.0, [-1.35, 0.5, -1.0], colors.chrome, 12);
  const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.8, 14), material(colors.ink, { metalness: 0.4, roughness: 0.28 }));
  scope.position.set(-1.35, 1.08, -1.0);
  scope.rotation.z = Math.PI / 2;
  overlook.add(scope);
  void scopeStand;
  const overlookSign = trailArrow(overlook, "overlook", 1.4, 0.9, 0);
  props.push({
    id: "rooftop-overlook",
    object: scope,
    prompt: "Look through the overlook scope",
    position: new THREE.Vector3(3.45, 1.05, -52.0),
    detail: "You can see the bedroom window from here. Continuity department is thrilled.",
  });
  props.push({
    id: "rooftop-overlook-sign",
    object: overlookSign,
    prompt: "Read the overlook sign",
    position: new THREE.Vector3(6.2, 1.2, -50.1),
    detail: "Mountain turnout. Please park tiny emotional vehicles responsibly.",
  });

  // A little glade: trees ringing a clearing, bushes and wildflowers.
  tree(parent, -6.5, -3, 1.2);
  tree(parent, 6.8, -2, 1.05);
  tree(parent, -7.2, 3.5, 0.95);
  tree(parent, 7.4, 4, 1.15);
  tree(parent, -3, -7.5, 1.3);
  tree(parent, 3.5, -8, 1.1);
  tree(parent, -8.8, -12.0, 1.15);
  tree(parent, 10.4, -11.0, 1.0);
  tree(parent, -5.0, -17.8, 1.25);
  tree(parent, 11.2, -19.0, 1.1);
  pine(parent, -14.5, -14.5, 1.0);
  pine(parent, -12.2, -24.0, 1.15);
  pine(parent, -6.8, -31.5, 0.98);
  pine(parent, 12.8, -29.0, 1.1);
  pine(parent, 15.0, -40.5, 1.18);
  pine(parent, -7.8, -44.0, 1.05);
  pine(parent, 12.7, -54.0, 1.25);
  for (const [bx, bz] of [[-5, 1], [5.5, 1.5], [-4, -4.5], [4, -3], [2, 4.5], [-2.5, 4.8], [-6, -10], [9, -8], [-7.4, -15.8], [8.5, -20], [-10, -26], [10.8, -33], [-5.4, -39], [13.0, -48]] as const) bush(parent, bx, bz);
  const flowerColors = [0xf2c14e, 0xe8632a, 0xe05a8f, 0xffffff, 0x9a5cc4];
  for (let i = 0; i < 46; i += 1) {
    flower(parent, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 22 - 4, flowerColors[i % flowerColors.length]);
  }
  for (let i = 0; i < 34; i += 1) {
    flower(parent, -12 + Math.random() * 24, -18 - Math.random() * 28, flowerColors[(i + 2) % flowerColors.length]);
  }

  // A shallow stream curls through the glade, with little stones crossing it.
  const streamCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-9.5, 0.04, -16),
    new THREE.Vector3(-5.8, 0.05, -10.4),
    new THREE.Vector3(-5.1, 0.05, -5.6),
    new THREE.Vector3(-2.0, 0.05, -3.2),
    new THREE.Vector3(0.4, 0.05, -1.2),
  ]);
  const stream = new THREE.Mesh(
    new THREE.TubeGeometry(streamCurve, 48, 0.42, 12, false),
    new THREE.MeshStandardMaterial({ color: 0x4d86b0, transparent: true, opacity: 0.66, roughness: 0.18, metalness: 0.05 }),
  );
  parent.add(stream);
  for (let i = 0; i < 6; i += 1) steppingStone(parent, -6.2 + i * 0.42, -8.9 + i * 0.52, 0.34);

  // A still pond with the golden duck paddling on it.
  const pond = new THREE.Mesh(new THREE.CircleGeometry(2.6, 32), new THREE.MeshStandardMaterial({ color: 0x4d86b0, transparent: true, opacity: 0.78, roughness: 0.2, metalness: 0.1 }));
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(-1.0, 0.04, -2.2);
  parent.add(pond);
  const pondDuck = duck(parent, [-1.0, 0.05, -2.2]);
  props.push({
    id: "rooftop-duck",
    object: pondDuck,
    prompt: "The golden duck",
    position: new THREE.Vector3(-1.0, 0.4, -2.2),
    detail: "You found your way outside. The duck approves. 🦆",
  });

  // A weathered bench to sit and take it in.
  const bench = new THREE.Group();
  bench.position.set(2.6, 0, 2.6);
  bench.rotation.y = -0.6;
  parent.add(bench);
  box(bench, [2.0, 0.16, 0.6], [0, 0.5, 0], 0x7a5333);
  box(bench, [2.0, 0.5, 0.14], [0, 0.8, -0.26], 0x7a5333);
  for (const px of [-0.85, 0.85]) box(bench, [0.14, 0.5, 0.5], [px, 0.25, 0], 0x5e3f25);
  props.push({
    id: "rooftop-bench",
    object: bench,
    prompt: "Sit on the bench",
    position: new THREE.Vector3(2.6, 0.6, 2.6),
    detail: "Golden hour. Nowhere to be.",
  });

  // Stepping-stone path from the doorway toward the pond.
  for (let i = 0; i < 5; i += 1) {
    steppingStone(parent, 3.4 - i * 1.1, 3.2 - i * 1.2);
  }

  // A few fireflies drift slowly in the warm air, enough to make the yard feel alive
  // without turning the scene into a carnival.
  const fireflies: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i += 1) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), new THREE.MeshBasicMaterial({ color: 0xfff0a0 }));
    f.position.set((Math.random() - 0.5) * 12, 0.6 + Math.random() * 2.2, (Math.random() - 0.5) * 9 - 1);
    parent.add(f);
    fireflies.push(f);
  }

  // The exact house you climbed out of, with the bedroom window facing the yard.
  // It is still a chapter transition under the hood, but the facade sells the geography.
  const house = new THREE.Group();
  house.position.set(0, 0, 7.6);
  parent.add(house);
  box(house, [8.4, 4.6, 5.8], [0, 2.3, 0], 0xece6da); // body
  for (let y = 0.65; y < 4.3; y += 0.55) {
    box(house, [8.55, 0.055, 0.08], [0, y, -2.95], 0xd8cdbd);
  }
  box(house, [8.8, 0.2, 0.5], [0, 4.7, -2.9], colors.walnut);
  const roofL = box(house, [5.8, 0.42, 6.4], [-2.28, 4.9, 0], 0x8a5a3a);
  roofL.rotation.z = 0.62;
  const roofR = box(house, [5.8, 0.42, 6.4], [2.28, 4.9, 0], 0x8a5a3a);
  roofR.rotation.z = -0.62;
  box(house, [0.6, 1.6, 0.6], [2.9, 5.9, 0.2], 0x5e3f25); // chimney
  box(house, [0.8, 0.18, 0.8], [2.9, 6.78, 0.2], 0x3d2d25);
  const porch = new THREE.Group();
  porch.position.set(1.55, 0, -3.1);
  house.add(porch);
  box(porch, [3.3, 0.28, 1.35], [0, 0.14, 0], colors.walnut);
  box(porch, [3.7, 0.22, 1.55], [0, 3.55, 0.05], 0x8a5a3a);
  for (const x of [-1.45, 1.45]) cylinder(porch, 0.08, 3.25, [x, 1.76, -0.48], colors.walnut, 8);

  // The bedroom window (warm-lit), including a tiny visible room slice inside.
  box(house, [2.75, 2.45, 0.14], [-2.1, 2.72, -2.94], colors.walnut); // frame
  const houseWindow = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 2.05), new THREE.MeshBasicMaterial({ color: 0xffdf9e }));
  houseWindow.position.set(-2.1, 2.72, -3.03);
  houseWindow.rotation.y = Math.PI;
  house.add(houseWindow);
  box(house, [0.1, 2.05, 0.08], [-2.1, 2.72, -3.12], colors.walnut);
  box(house, [2.35, 0.1, 0.08], [-2.1, 2.72, -3.13], colors.walnut);
  box(house, [2.25, 0.22, 0.52], [-2.1, 1.34, -3.08], 0x6b4a2b); // flower box
  for (let i = 0; i < 5; i += 1) {
    cylinder(house, 0.018, 0.32, [-2.92 + i * 0.4, 1.55, -3.12], 0x3f7d39, 5);
    const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), material(flowerColors[(i + 2) % flowerColors.length], { roughness: 0.7 }));
    bloom.position.set(-2.92 + i * 0.4, 1.72, -3.12);
    house.add(bloom);
  }
  box(house, [1.12, 0.24, 0.52], [-2.52, 2.03, -3.18], colors.tuftsBrown); // tiny bed visible through window
  cylinder(house, 0.18, 0.06, [-1.52, 2.08, -3.2], colors.ink, 20).rotation.x = Math.PI / 2; // tiny record
  const escapeLadder = new THREE.Group();
  escapeLadder.position.set(-3.82, 0.2, -3.25);
  escapeLadder.rotation.z = -0.08;
  house.add(escapeLadder);
  for (const x of [-0.22, 0.22]) cylinder(escapeLadder, 0.025, 2.55, [x, 1.28, 0], colors.chrome, 6);
  for (let y = 0.25; y < 2.45; y += 0.34) box(escapeLadder, [0.58, 0.035, 0.035], [0, y, 0], colors.chrome, { metalness: 0.6 });
  const signCanvas = document.createElement("canvas");
  signCanvas.width = 512;
  signCanvas.height = 160;
  const signContext = signCanvas.getContext("2d");
  if (signContext) {
    signContext.fillStyle = "#fff9e9";
    signContext.fillRect(0, 0, 512, 160);
    signContext.strokeStyle = "#d82f24";
    signContext.lineWidth = 16;
    signContext.strokeRect(10, 10, 492, 140);
    signContext.fillStyle = "#17130f";
    signContext.font = "900 42px Arial, sans-serif";
    signContext.textAlign = "center";
    signContext.textBaseline = "middle";
    signContext.fillText("WINDOW EXIT", 256, 58);
    signContext.font = "800 30px Arial, sans-serif";
    signContext.fillText("MIND THE LADDER", 256, 105);
  }
  const signTexture = new THREE.CanvasTexture(signCanvas);
  signTexture.colorSpace = THREE.SRGBColorSpace;
  const noTeleportSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.65, 0.52),
    new THREE.MeshBasicMaterial({ map: signTexture }),
  );
  noTeleportSign.position.set(-3.72, 1.25, -3.34);
  noTeleportSign.rotation.y = Math.PI;
  house.add(noTeleportSign);

  for (const x of [2.9, -0.1]) {
    box(house, [1.15, 1.15, 0.12], [x, 2.9, -2.98], colors.walnut);
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ color: 0xfff0c2, transparent: true, opacity: 0.82 }));
    pane.position.set(x, 2.9, -3.06);
    pane.rotation.y = Math.PI;
    house.add(pane);
  }

  // The door back inside.
  const door = box(house, [1.25, 2.65, 0.22], [1.55, 1.58, -3.0], 0x5e3f25);
  box(door, [0.1, 0.1, 0.08], [0.44, 0.08, -0.14], 0xd9a441, { metalness: 0.65 });
  const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 2.26), new THREE.MeshBasicMaterial({ color: 0xfff1d6, transparent: true, opacity: 0.5 }));
  doorGlow.position.set(1.55, 1.58, -3.12);
  doorGlow.rotation.y = Math.PI;
  house.add(doorGlow);
  const portals: Portal[] = [
    {
      id: "portal-rooftop-exit",
      target: "recovery",
      title: "Back inside",
      prompt: "Head back inside",
      position: new THREE.Vector3(1.5, 1.3, 5.0),
      object: door,
    },
  ];

  const woodpile = new THREE.Group();
  woodpile.position.set(4.7, 0, 3.7);
  woodpile.rotation.y = -0.45;
  parent.add(woodpile);
  for (let i = 0; i < 6; i += 1) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.15, 10), material(0x6b4a2b, { roughness: 0.9 }));
    log.position.set((i % 3) * 0.28, 0.16 + Math.floor(i / 3) * 0.22, 0);
    log.rotation.z = Math.PI / 2;
    woodpile.add(log);
  }
  props.push({
    id: "rooftop-woodpile",
    object: woodpile,
    prompt: "Check the woodpile",
    position: new THREE.Vector3(4.7, 0.45, 3.7),
    detail: "Stacked neatly. The outside world has chosen emotional stability.",
  });

  // Campfire — light it for a warm crackling glow.
  const fire = new THREE.Group();
  fire.position.set(2.2, 0, 1.4);
  parent.add(fire);
  for (let i = 0; i < 7; i += 1) {
    const a = (i / 7) * Math.PI * 2;
    cylinder(fire, 0.15, 0.2, [Math.cos(a) * 0.55, 0.1, Math.sin(a) * 0.55], 0x8a8079, 6);
  }
  box(fire, [0.7, 0.12, 0.18], [0, 0.13, 0], 0x5e3f25).rotation.y = 0.5;
  box(fire, [0.7, 0.12, 0.18], [0.05, 0.13, 0], 0x5e3f25).rotation.y = -0.6;
  const flames = new THREE.Group();
  flames.visible = false;
  fire.add(flames);
  const flameMeshes: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i += 1) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5 + Math.random() * 0.3, 7), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffb43e : 0xff6a2a }));
    f.position.set((Math.random() - 0.5) * 0.3, 0.35, (Math.random() - 0.5) * 0.3);
    flames.add(f);
    flameMeshes.push(f);
  }
  const fireLight = new THREE.PointLight(0xff7b2e, 0, 10, 1.6);
  fireLight.position.set(0, 0.7, 0);
  fire.add(fireLight);
  props.push({
    id: "rooftop-fire",
    object: fire,
    prompt: "Light the campfire",
    position: new THREE.Vector3(2.2, 0.4, 1.4),
    toggle: (on) => { flames.visible = on; fireLight.intensity = on ? 14 : 0; },
    detail: "Crackle.",
  });

  // A rope swing on the big tree.
  const swing = new THREE.Group();
  swing.position.set(-6.0, 2.7, -1.0);
  parent.add(swing);
  for (const rx of [-0.4, 0.4]) cylinder(swing, 0.02, 2.1, [rx, -1.05, 0], 0x6b5333, 5);
  const seat = box(swing, [1.1, 0.1, 0.4], [0, -2.1, 0], 0x7a5333);
  let swingT = 0;
  props.push({
    id: "rooftop-swing",
    object: seat,
    prompt: "Take a swing",
    position: new THREE.Vector3(-5.5, 1.0, -1.0),
    activate: () => { swingT = 1; },
    detail: "Wheee.",
  });

  // Skip a stone across the pond — sends out a ripple.
  const ripple = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.32, 24), new THREE.MeshBasicMaterial({ color: 0xdfeef7, transparent: true, opacity: 0 }));
  ripple.rotation.x = -Math.PI / 2;
  ripple.position.set(-1.0, 0.07, -2.2);
  parent.add(ripple);
  let rippleT = 0;
  props.push({
    id: "rooftop-skip",
    object: pond,
    prompt: "Skip a stone",
    position: new THREE.Vector3(0.8, 0.3, -1.8),
    activate: () => { rippleT = 0.001; },
    detail: "Plip… plip… plip.",
  });

  // Hammock, birds, wind chimes, and a mischievous day/night switch make the
  // glade feel like a place instead of a waiting room.
  const hammock = new THREE.Group();
  hammock.position.set(-7.0, 0, -8.4);
  hammock.rotation.y = 0.5;
  parent.add(hammock);
  for (const x of [-1.3, 1.3]) {
    cylinder(hammock, 0.08, 2.25, [x, 1.1, 0], colors.walnut, 8).rotation.z = x < 0 ? -0.18 : 0.18;
  }
  const sling = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.78), material(0xf3eee2, { roughness: 0.9 }));
  sling.position.set(0, 1.0, 0);
  sling.rotation.z = 0.04;
  hammock.add(sling);
  for (const x of [-1.05, 1.05]) {
    for (const z of [-0.36, 0.36]) {
      const rope = cylinder(hammock, 0.018, 0.72, [x, 1.2, z], 0x6b5333, 5);
      rope.rotation.z = x < 0 ? 1.1 : -1.1;
    }
  }
  let hammockT = 0;
  props.push({
    id: "rooftop-hammock",
    object: sling,
    prompt: "Collapse into the hammock",
    position: new THREE.Vector3(-7.0, 1.0, -8.4),
    activate: () => { hammockT = 1; },
    detail: "A responsible five-minute break, legally speaking.",
  });

  const chimes = new THREE.Group();
  chimes.position.set(-5.2, 2.25, 5.1);
  parent.add(chimes);
  box(chimes, [0.9, 0.08, 0.08], [0, 0.18, 0], colors.walnut);
  const chimeBars: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i += 1) {
    const bar = cylinder(chimes, 0.025, 0.55 + i * 0.08, [-0.36 + i * 0.18, -0.16 - i * 0.035, 0], colors.chrome, 8);
    bar.rotation.x = 0.02;
    chimeBars.push(bar);
  }
  props.push({
    id: "rooftop-chimes",
    object: chimes,
    prompt: "Listen to the wind chimes",
    position: new THREE.Vector3(-5.2, 2.1, 5.1),
    detail: "Tinny little proof that the wind has a personality.",
  });

  const birds = [
    bird(parent, -4.4, 4.3, -9.8),
    bird(parent, -3.7, 4.65, -10.4),
    bird(parent, -5.1, 4.55, -10.8),
  ];
  props.push({
    id: "rooftop-birds",
    object: birds[0],
    prompt: "Watch the birds",
    position: new THREE.Vector3(-4.4, 3.6, -9.8),
    detail: "They seem to know exactly where the navbar is hidden.",
  });

  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.6, 18, 12), new THREE.MeshBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: 0 }));
  moon.position.set(24, 14, -34);
  parent.add(moon);
  const stars: THREE.Mesh[] = [];
  for (let i = 0; i < 24; i += 1) {
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
    star.position.set(-28 + Math.random() * 56, 11 + Math.random() * 12, -22 - Math.random() * 28);
    parent.add(star);
    stars.push(star);
  }
  let night = false;
  props.push({
    id: "rooftop-night",
    object: sun,
    prompt: "Ask the sky to do the bit",
    position: new THREE.Vector3(-4.5, 1.2, -6.4),
    activate: () => { night = !night; },
    detail: "The sky says, sure, but only because this is a portfolio.",
  });

  const { car, body: carBody, wheels, exhaust } = buildCar(parent);
  props.push({
    id: "rooftop-car",
    object: carBody,
    prompt: "Get in the car",
    position: new THREE.Vector3(4.6, 0.8, -0.4),
    detail: "Driving. W/S gas and brake, A/D steer, E exits.",
    vehicle: {
      object: car,
      wheels,
      exhaust,
      cameraOffset: new THREE.Vector3(-3.2, 1.7, 0),
    },
  });

  let t = 0;
  return {
    entry: [-2.0, 1.72, 4.35],
    bounds: { minX: -17.5, maxX: 17.5, minZ: -57.5, maxZ: 5.4 },
    portals,
    props,
    colliders: [
      { ...blocker(0, 7.0, 4.5, 1.0) },
      { ...blocker(2.2, 1.4, 1.0, 0.8), top: 0.3 },
      { ...blocker(2.6, 2.6, 1.1, 0.5), top: 0.5 },
      { ...blocker(-7.0, -8.4, 1.6, 0.7), top: 1.0 },
      { ...blocker(-14.0, -5.0, 1.45, 1.2), top: 2.0 },
      { ...blocker(4.7, 3.7, 0.9, 0.55), top: 0.45 },
    ],
    animated: [
      (_elapsed, delta) => {
        t += delta;
        pondDuck.position.y = 0.05 + Math.sin(t * 1.4) * 0.03;
        pondDuck.rotation.y = Math.sin(t * 0.22) * 0.18;
        fireflies.forEach((f, i) => {
          f.position.x += Math.sin(t * 0.24 + i) * delta * 0.08;
          f.position.y += Math.cos(t * 0.2 + i * 1.7) * delta * 0.06;
          (f.material as THREE.MeshBasicMaterial).opacity = 0.28 + Math.abs(Math.sin(t * 0.9 + i)) * 0.32;
          (f.material as THREE.MeshBasicMaterial).transparent = true;
        });
        (doorGlow.material as THREE.MeshBasicMaterial).opacity = 0.34 + Math.sin(t * 0.9) * 0.08;
        const nightMix = night ? 1 : 0;
        (moon.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp((moon.material as THREE.MeshBasicMaterial).opacity, nightMix * 0.85, delta * 2);
        sun.material.opacity = THREE.MathUtils.lerp((sun.material as THREE.MeshBasicMaterial).opacity ?? 1, night ? 0.28 : 1, delta * 2);
        (sun.material as THREE.MeshBasicMaterial).transparent = true;
        stars.forEach((star, i) => {
          (star.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
            (star.material as THREE.MeshBasicMaterial).opacity,
            nightMix * (0.35 + Math.abs(Math.sin(t * 1.5 + i)) * 0.55),
            delta * 2,
          );
        });
        if (flames.visible) {
          flameMeshes.forEach((f, i) => { f.scale.y = 0.92 + Math.abs(Math.sin(t * 5 + i)) * 0.22; });
          fireLight.intensity = 10 + Math.sin(t * 5) * 1.5;
        }
        if (swingT > 0) {
          swing.rotation.x = Math.sin(t * 2.6) * swingT * 0.32;
          swingT = Math.max(0, swingT - delta * 0.35);
        }
        if (hammockT > 0) {
          hammock.rotation.z = Math.sin(t * 2.2) * hammockT * 0.045;
          hammockT = Math.max(0, hammockT - delta * 0.28);
        }
        chimeBars.forEach((bar, i) => {
          bar.rotation.z = Math.sin(t * 0.75 + i) * 0.025;
        });
        birds.forEach((b, i) => {
          b.position.y += Math.cos(t * 0.45 + i) * delta * 0.025;
          b.rotation.z = Math.sin(t * 0.8 + i) * 0.06;
        });
        if (rippleT > 0) {
          rippleT += delta;
          const k = Math.min(1, rippleT / 1.4);
          ripple.scale.setScalar(1 + k * 6);
          (ripple.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.6;
          if (k >= 1) { rippleT = 0; ripple.scale.setScalar(1); }
        }
      },
    ],
    steps: [],
  };
}
