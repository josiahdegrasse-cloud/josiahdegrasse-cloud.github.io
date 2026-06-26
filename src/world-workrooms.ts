import * as THREE from "three";
import {
  blocker,
  board,
  box,
  colors,
  couch,
  cylinder,
  floor,
  laptop,
  rug,
  shelf,
  sign,
  speaker,
  spotlight,
  table,
  wall,
} from "./game-kit";
import type { ChapterDefinition, ChapterResult } from "./game-types";

function factoryShell(parent: THREE.Group, z: number) {
  floor(parent, [15, 22], [0, -0.16, z], colors.concrete);
  wall(parent, [22, 8.5], [-7.35, 4.1, z], colors.charcoal, Math.PI / 2);
  wall(parent, [22, 8.5], [7.35, 4.1, z], colors.charcoal, Math.PI / 2);
  wall(parent, [15, 8.5], [0, 4.1, z - 10.9], colors.steel);
  for (let offset = -9; offset <= 9; offset += 4.5) {
    box(parent, [14.5, 0.22, 0.22], [0, 7.5, z + offset], colors.steel, { metalness: 0.65 });
  }
  for (const x of [-5.8, 5.8]) {
    box(parent, [0.45, 8, 0.45], [x, 4, z], colors.yellow);
    box(parent, [12, 0.35, 0.35], [0, 7.2, z], colors.yellow);
  }
  for (let offset = -8; offset <= 8; offset += 2) {
    box(parent, [0.08, 0.025, 1], [0, 0, z + offset], colors.yellow);
  }
}

function boiler(parent: THREE.Object3D, position: [number, number, number]) {
  const group = new THREE.Group();
  group.position.set(...position);
  parent.add(group);
  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.35, 7.2, 40, 1, true),
    new THREE.MeshStandardMaterial({ color: colors.steel, metalness: 0.62, roughness: 0.3, side: THREE.DoubleSide }),
  );
  shell.rotation.z = Math.PI / 2;
  shell.position.y = 2.7;
  group.add(shell);
  const end = new THREE.Mesh(
    new THREE.SphereGeometry(2.35, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: colors.steel, metalness: 0.6, roughness: 0.3 }),
  );
  end.rotation.z = -Math.PI / 2;
  end.position.set(-3.6, 2.7, 0);
  group.add(end);
  const tubePlate = cylinder(group, 2.2, 0.18, [3.6, 2.7, 0], colors.ink, 40);
  tubePlate.rotation.z = Math.PI / 2;
  for (let row = -2; row <= 2; row += 1) {
    for (let col = -2; col <= 2; col += 1) {
      const tube = cylinder(group, 0.13, 0.28, [3.72, 2.7 + row * 0.62, col * 0.62], colors.chrome, 18);
      tube.rotation.z = Math.PI / 2;
    }
  }
  for (const x of [-2.2, 2.2]) {
    box(group, [1.4, 0.55, 4.8], [x, 0.28, 0], colors.ink);
  }
  return group;
}

export function buildHelfrich(parent: THREE.Group, chapter: ChapterDefinition): ChapterResult {
  const { z } = chapter;
  factoryShell(parent, z);
  sign(parent, "HELFRICH BROTHERS", "Boiler works and pressure-part fabrication", [-3.8, 5.3, z - 10.65], "#f6c83f", "#17130f", "#17130f");
  const mainBoiler = boiler(parent, [-1.2, 0, z - 3.5]);
  const fixtureTable = table(parent, [-3.7, 0, z + 6], [5.2, 2.2], colors.steel, colors.yellow);
  const fixture = new THREE.Group();
  fixture.position.set(-3.7, 1.45, z + 6);
  parent.add(fixture);
  for (const x of [-1.8, -0.6, 0.6, 1.8]) {
    cylinder(fixture, 0.5, 0.5, [x, 0, 0], colors.chrome);
    box(fixture, [0.16, 0.8, 0.16], [x, 0.55, 0.5], colors.yellow);
  }
  const robot = new THREE.Group();
  robot.position.set(4.8, 0.4, z + 3.2);
  parent.add(robot);
  cylinder(robot, 0.65, 0.55, [0, 0.28, 0], colors.red);
  const armA = box(robot, [0.48, 2.8, 0.48], [0, 1.75, 0], colors.red);
  armA.rotation.z = -0.45;
  const armB = box(robot, [0.42, 2.2, 0.42], [0.95, 3.55, 0], colors.yellow);
  armB.rotation.z = 0.7;
  const blueprint = board(parent, [4.9, 2.8, z - 7.8], [3.7, 2.5], colors.powder);
  for (let index = 0; index < 6; index += 1) {
    box(parent, [2.6, 0.05, 0.05], [4.9, 3.6 - index * 0.34, z - 7.66], index === 2 ? colors.red : colors.blue);
  }
  shelf(parent, [5.9, 0, z + 7.7], [2.2, 5.3, 1.5], colors.yellow, 4);
  const throughput = sign(parent, "3 HEADS / 3 HOURS", "REDESIGNED: 8 / 45 MINUTES", [3.9, 5.2, z + 9.8], "#17130f", "#fff9e9", "#f6c83f", [5.6, 2]);
  spotlight(parent, colors.white, [-1, 8, z - 3], [-1, 2, z - 3], 95);
  spotlight(parent, colors.yellow, [-3.5, 7, z + 6], [-3.5, 1, z + 6], 60);

  // --- fill: steel stock, gas cylinders, tool cart, crates ---
  for (let i = 0; i < 4; i += 1) box(parent, [2.4, 0.18, 1.4], [-5.4, 0.2 + i * 0.2, z + 1], colors.steel, { metalness: 0.5 });
  for (const cz of [-7.2, -6.4, -5.6]) {
    cylinder(parent, 0.32, 2.0, [-6.4, 1.0, z + cz], colors.red, 16);
    box(parent, [0.2, 0.3, 0.2], [-6.4, 2.1, z + cz], colors.ink);
  }
  box(parent, [1.4, 1.0, 0.8], [2.2, 0.5, z + 8], colors.yellow);
  box(parent, [1.5, 0.1, 0.9], [2.2, 1.05, z + 8], colors.ink);
  for (let i = 0; i < 3; i += 1) box(parent, [1.6, 1.2, 1.6], [5.4, 0.6 + i * 1.2, z - 2], colors.tuftsBrown);

  return {
    colliders: [
      blocker(-1.2, z - 3.5, 3.8, 2.5), // boiler
      blocker(-3.7, z + 6, 2.0, 1.1),   // fixture table
      blocker(4.8, z + 3.2, 0.9, 0.9),  // welding robot
      blocker(6.0, z + 7.7, 0.7, 1.5),  // parts shelf
      blocker(-5.4, z + 1, 1.3, 0.8),   // steel stock
      blocker(-6.4, z - 6.4, 0.5, 1.2), // gas cylinders
      blocker(2.2, z + 8, 0.9, 0.6),    // tool cart
      blocker(5.4, z - 2, 0.9, 0.9),    // crates
    ],
    animated: [(elapsed) => { robot.rotation.y = Math.sin(elapsed * 0.75) * 0.24; }],
    steps: [
      {
        id: "helfrich-measure",
        chapter: "helfrich",
        order: 0,
        title: "Understand the vessel",
        prompt: "Walk the pressure vessel and inspect its tube plate",
        dossier: "helfrich",
        objective: "Inspect the full-size industrial boiler",
        detail: "The scale matters. Every drawing and fixture has to survive contact with thousands of pounds of steel and the people fabricating it.",
        position: new THREE.Vector3(2.5, 2.8, z - 3),
        object: mainBoiler,
        activate: () => mainBoiler.rotation.y = 0.03,
      },
      {
        id: "helfrich-fixture",
        chapter: "helfrich",
        order: 1,
        title: "Load the redesigned fixture",
        prompt: "Lock four boiler heads into the locating fixture",
        objective: "Load the production fixture",
        detail: "Locating geometry and repeatable clamps let the welding cell process more parts with less handling and rework.",
        position: new THREE.Vector3(-3.7, 1.7, z + 5.2),
        object: fixtureTable,
        activate: () => fixture.children.forEach((child, index) => child.rotation.y = index * 0.08),
      },
      {
        id: "helfrich-run",
        chapter: "helfrich",
        order: 2,
        title: "Run the improved cell",
        prompt: "Press cycle start on the welding cell",
        objective: "Run the improved manufacturing process",
        detail: "The redesigned process increased throughput from three heads in three hours to eight in 45 minutes.",
        position: new THREE.Vector3(4.8, 2, z + 2.4),
        object: robot,
        activate: () => {
          robot.rotation.z = 0.08;
          throughput.scale.setScalar(1.04);
          blueprint.rotation.z = -0.03;
        },
      },
    ],
  };
}

function recordShelf(parent: THREE.Object3D, position: [number, number, number]) {
  const unit = shelf(parent, position, [4.8, 4.5, 0.8], colors.walnut, 5);
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      box(unit, [0.05, 0.62, 0.58], [-2.05 + col * 0.45, 0.45 + row * 0.85, 0], [colors.red, colors.yellow, colors.blue, colors.pink, colors.white][(row + col) % 5]);
    }
  }
}

export function buildHeadTap(parent: THREE.Group, chapter: ChapterDefinition): ChapterResult {
  const { z } = chapter;
  floor(parent, [15, 22], [0, -0.16, z], colors.walnut);
  wall(parent, [22, 5.9], [-7.35, 2.85, z], colors.walnut, Math.PI / 2);
  wall(parent, [22, 5.9], [7.35, 2.85, z], colors.walnut, Math.PI / 2);
  wall(parent, [15, 5.9], [0, 2.85, z - 10.9], colors.oxblood);
  rug(parent, [0, 0.01, z - 0.5], [9.5, 7], [colors.oxblood, colors.pink, colors.yellow, colors.green]);
  couch(parent, [0, 0, z + 2.2], colors.green, Math.PI);
  const coffeeTable = table(parent, [0, 0, z - 0.2], [4.5, 2.2], colors.walnut);
  coffeeTable.scale.y = 0.52; // a low lounge table, not a dining-height one
  speaker(parent, [-4.8, 0, z - 5.8], colors.walnut);
  speaker(parent, [4.8, 0, z - 5.8], colors.walnut);
  recordShelf(parent, [-4.7, 0, z + 7.8]);
  recordShelf(parent, [4.7, 0, z + 7.8]);

  // --- Filled-in lounge: bar, stools, bottles, pendant lights, posters ---
  const bar = new THREE.Group();
  bar.position.set(6.0, 0, z + 1);
  parent.add(bar);
  box(bar, [1.0, 1.15, 6.2], [0, 0.58, 0], colors.walnut);
  box(bar, [1.25, 0.16, 6.4], [0, 1.22, 0], colors.ink, { metalness: 0.3 });
  box(bar, [0.5, 3.0, 6.4], [0.55, 1.7, 0], colors.oxblood);
  for (let i = 0; i < 9; i += 1) {
    cylinder(bar, 0.08, 0.42 + (i % 3) * 0.12, [0.42, 1.55, -2.8 + i * 0.7], [colors.green, colors.yellow, colors.pink, colors.white][i % 4], 10);
  }
  for (const sz of [-1.6, 0, 1.6]) {
    cylinder(bar, 0.3, 0.12, [-1.1, 1.0, sz], colors.ink, 16);
    cylinder(bar, 0.06, 1.0, [-1.1, 0.5, sz], colors.chrome, 10);
  }
  for (const px of [-1.0, 1.0]) {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 12),
      new THREE.MeshStandardMaterial({ color: colors.yellow, emissive: colors.orange, emissiveIntensity: 1.5 }),
    );
    orb.position.set(px, 3.4, z - 0.2);
    parent.add(orb);
    box(parent, [0.03, 1.4, 0.03], [px, 4.1, z - 0.2], colors.ink);
  }
  board(parent, [-7.05, 3.3, z - 2], [2.4, 1.6], colors.pink, Math.PI / 2);
  board(parent, [-7.05, 3.0, z + 3.5], [2.0, 2.6], colors.yellow, Math.PI / 2);

  const turntable = new THREE.Group();
  turntable.position.set(-0.8, 1.48, 0);
  coffeeTable.add(turntable);
  box(turntable, [2.05, 0.22, 1.58], [0, 0, 0], colors.walnut);
  box(turntable, [1.9, 0.07, 1.42], [0, .14, 0], colors.ink);
  const record = cylinder(turntable, 0.62, 0.06, [-0.2, .23, 0], colors.ink, 48);
  cylinder(turntable, 0.11, 0.08, [-0.2, .27, 0], colors.pink, 20);
  const roomTonearm = box(turntable, [0.09, 0.08, 0.78], [0.66, .28, -0.08], colors.chrome);
  roomTonearm.rotation.y = -.26;
  cylinder(turntable, .11, .12, [.82, .26, .27], colors.chrome, 16);
  cylinder(turntable, .07, .05, [.7, .25, -.57], colors.red, 12);
  const recordLid = box(turntable, [1.95, .05, 1.34], [0, .82, -.62], colors.powder, {
    transparent: true,
    opacity: .22,
  });
  recordLid.rotation.x = -1.08;
  laptop(coffeeTable, [1.1, 1.52, 0], colors.pink, Math.PI);
  cylinder(coffeeTable, 0.18, 0.34, [0.1, 1.52, 0.55], colors.white);
  const map = board(parent, [0, 3.1, z - 10.7], [5.8, 3.3], colors.powder);
  const nodes: THREE.Mesh[] = [];
  for (const [x, y] of [[-1.8, 3.4], [-0.6, 2.4], [0.8, 3.5], [1.9, 2.6]]) {
    nodes.push(cylinder(parent, 0.14, 0.18, [x, y, z - 10.55], colors.red));
  }
  const phone = box(coffeeTable, [0.65, 1.2, 0.08], [1.7, 1.55, -0.3], colors.ink);
  box(coffeeTable, [0.55, 1.05, 0.03], [1.7, 1.56, -0.25], colors.pink, { emissive: colors.pink, emissiveIntensity: 0.4 });
  sign(parent, "HEADTAP", "MUSIC WORTH LEAVING THE HOUSE FOR", [0, 5.1, z + 9.7], "#17130f", "#fff9e9", "#f26a8d", [5.5, 1.5]);
  spotlight(parent, colors.orange, [0, 5.6, z + 1], [0, 1, z], 55);
  spotlight(parent, colors.pink, [0, 5.4, z - 6], [0, 1, z - 6], 70);

  return {
    colliders: [
      blocker(0, z + 2.2, 1.6, 0.9),   // couch
      blocker(0, z - 0.2, 2.2, 1.1),   // coffee table
      blocker(-4.8, z - 5.8, 0.7, 0.7), // left speaker
      blocker(4.8, z - 5.8, 0.7, 0.7),  // right speaker
      blocker(-4.7, z + 7.8, 2.2, 0.5), // left record shelf
      blocker(4.7, z + 7.8, 2.2, 0.5),  // right record shelf
      blocker(6.0, z + 1, 0.9, 3.4),    // bar
    ],
    animated: [(_, delta) => { record.rotation.y += delta * 1.5; }],
    steps: [
      {
        id: "headtap-listen",
        chapter: "headtap",
        order: 0,
        title: "Read the room",
        prompt: "Choose a record and lower the needle",
        playsMusic: true,
        objective: "Play a record from the listening history",
        detail: "HeadTap starts with taste, not popularity. The room becomes the listener’s profile.",
        position: new THREE.Vector3(-0.8, 1.0, z + 0.5),
        object: turntable,
        activate: () => {
          const recordMaterial = record.material as THREE.MeshStandardMaterial;
          recordMaterial.emissive.setHex(colors.pink);
          recordMaterial.emissiveIntensity = 0.35;
          roomTonearm.rotation.y = -.62;
          recordLid.rotation.x = -1.16;
        },
      },
      {
        id: "headtap-connect",
        chapter: "headtap",
        order: 1,
        title: "Map the night",
        prompt: "Pin matching artists to Madrid venues",
        dossier: "headtap",
        objective: "Match the listener to nearby venues",
        detail: "Listening history, artist similarity, venue, date, and distance converge on a physical map of Madrid.",
        position: new THREE.Vector3(0, 2.8, z - 9.8),
        object: map,
        activate: () => nodes.forEach((node, index) => {
          const nodeMaterial = node.material as THREE.MeshStandardMaterial;
          nodeMaterial.emissive.setHex(index % 2 ? colors.yellow : colors.pink);
          nodeMaterial.emissiveIntensity = 1;
        }),
      },
      {
        id: "headtap-recommend",
        chapter: "headtap",
        order: 2,
        title: "Send the recommendation",
        prompt: "Send the concert card to the listener",
        objective: "Publish the concert recommendation",
        detail: "A recommendation earns trust by explaining why the artist, venue, date, and mood belong together.",
        position: new THREE.Vector3(1.7, 1.65, z),
        object: phone,
        activate: () => phone.rotation.z = -0.08,
      },
      {
        id: "headtap-off-menu",
        chapter: "headtap",
        order: 9,
        title: "The off-menu frequency",
        prompt: "Ask the bar for the off-menu mix",
        objective: "Find the room’s hidden record",
        detail: "Some recommendations only appear when you leave the obvious catalog and ask what the room has been quietly saving.",
        position: new THREE.Vector3(5.2, 1.6, z + 1),
        object: bar,
        optional: true,
        secret: true,
        activate: () => {
          bar.rotation.z = bar.rotation.z === 0 ? 0.015 : 0;
          window.dispatchEvent(new CustomEvent("portfolio-keepsake", { detail: "off-menu-record" }));
        },
      },
    ],
  };
}
