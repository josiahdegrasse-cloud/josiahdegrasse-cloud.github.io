import * as THREE from "three";
import {
  blocker,
  board,
  box,
  colors,
  cylinder,
  floor,
  imagePanel,
  makeLacrosseHead,
  shelf,
  sign,
  spotlight,
  table,
  wall,
} from "./game-kit";
import type { ChapterDefinition, ChapterResult } from "./game-types";

function trophy(parent: THREE.Object3D, x: number, z: number, year: string) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  parent.add(group);
  box(group, [2.1, 0.58, 1.45], [0, 0.3, 0], colors.tuftsBrown);
  cylinder(group, 0.42, 1.5, [0, 1.25, 0], colors.yellow);
  const cup = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.62),
    new THREE.MeshStandardMaterial({ color: colors.yellow, metalness: 0.72, roughness: 0.16 }),
  );
  cup.rotation.x = Math.PI;
  cup.position.y = 2.25;
  group.add(cup);
  sign(group, year, "NCAA DIVISION III CHAMPION", [0, 0.34, 0.78], "#5f4638", "#fff9e9", "#3e8ede", [1.75, 0.78]);
  return group;
}

function varsityLocker(parent: THREE.Object3D, x: number, z: number, number: string) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  parent.add(group);
  box(group, [1.8, 4.5, 1.5], [0, 2.25, 0], colors.tuftsBrown);
  box(group, [1.55, 2.7, 1.2], [0, 2.35, 0.2], colors.ink);
  box(group, [1.45, 0.2, 1.2], [0, 0.72, 0.2], colors.tuftsBlue);
  sign(group, number, "TUFTS", [0, 4.05, 0.77], "#3e8ede", "#fff9e9", "#5f4638", [1.35, 0.65]);
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62),
    new THREE.MeshStandardMaterial({ color: colors.white, roughness: 0.35 }),
  );
  helmet.position.set(0, 1.25, 0.35);
  group.add(helmet);
  return group;
}

function lockerRoomShell(parent: THREE.Group, z: number) {
  floor(parent, [15, 22], [0, -0.16, z], 0xe4e2dc);
  wall(parent, [22, 6.8], [-7.35, 3.25, z], colors.tuftsBlue, Math.PI / 2);
  wall(parent, [22, 6.8], [7.35, 3.25, z], colors.tuftsBlue, Math.PI / 2);
  wall(parent, [15, 6.8], [0, 3.25, z - 10.9], colors.tuftsBrown);
  for (let offset = -8.5; offset <= 8.5; offset += 2.25) {
    box(parent, [0.08, 0.02, 1.4], [0, 0, z + offset], colors.tuftsBlue);
  }
}

export function buildLacrosse(parent: THREE.Group, chapter: ChapterDefinition): ChapterResult {
  const { z } = chapter;
  lockerRoomShell(parent, z);
  sign(parent, "TUFTS MEN'S LACROSSE", "CHAMPIONSHIP LOCKER ROOM", [0, 5.35, z - 10.65], "#3e8ede", "#fff9e9", "#5f4638", [6.2, 1.7]);
  for (const side of [-1, 1]) {
    for (let index = 0; index < 4; index += 1) {
      varsityLocker(parent, side * 6.25, z - 7.5 + index * 4.5, `${12 + index * 5}`);
    }
  }
  const trophies = [
    trophy(parent, -3.5, z - 6.5, "2024"),
    trophy(parent, 0, z - 7.1, "2025"),
    trophy(parent, 3.5, z - 6.5, "2026"),
  ];
  spotlight(parent, colors.yellow, [0, 6.5, z - 5], [0, 1, z - 6], 95);

  const cultureTable = table(parent, [-4.1, 0, z + 4.7], [4.4, 2.4], colors.tuftsBrown);
  for (let index = 0; index < 5; index += 1) {
    box(cultureTable, [0.7, 0.04, 1], [-1.45 + index * 0.72, 1.4, 0], colors.white).rotation.y = -0.12 + index * 0.05;
  }
  sign(parent, "THE DAILY 'CAC", "TEAM PAPER • PEER SUPPORT • COMMUNITY", [-4.2, 3.6, z + 8.8], "#fff9e9", "#17130f", "#3e8ede", [4.4, 2]);
  const coachingBoard = board(parent, [-7.15, 3.2, z + 4], [6, 4.4], colors.white, Math.PI / 2);
  for (let index = 0; index < 6; index += 1) {
    cylinder(parent, 0.08, 0.04, [-7.01, 2 + (index % 3) * 0.75, z + 2.2 + Math.floor(index / 3) * 1.8], index % 2 ? colors.tuftsBlue : colors.red);
  }

  const workshop = table(parent, [3.9, 0, z + 4.5], [5.2, 2.7], colors.tuftsBrown);
  const cadPanel = imagePanel(parent, "/portfolio/assets/lacrosse-head-cad.png", [5.8, 3.5, z + 8.9], [2.6, 3.2]);
  imagePanel(parent, "/portfolio/assets/lacrosse-action.png", [-5.7, 3.5, z - 10.65], [2.5, 3.2]);
  shelf(parent, [6.2, 0, z + 7.5], [1.6, 4.6, 1.1], colors.tuftsBlue, 4);

  const printer = new THREE.Group();
  printer.position.set(3.8, 1.4, z + 4.4);
  parent.add(printer);
  box(printer, [3.5, 0.25, 2.2], [0, 0, 0], colors.ink);
  for (const x of [-1.5, 1.5]) {
    for (const zz of [-0.9, 0.9]) cylinder(printer, 0.07, 3, [x, 1.5, zz], colors.chrome);
  }
  box(printer, [3.3, 0.2, 0.4], [0, 2.85, 0], colors.tuftsBlue);
  const printHead = box(printer, [0.52, 0.35, 0.52], [0, 2.55, 0], colors.yellow);
  const printedHead = makeLacrosseHead(colors.white);
  printedHead.position.set(0, 0.75, 0);
  printedHead.scale.setScalar(0.01);
  printer.add(printedHead);
  const shaft = cylinder(workshop, 0.07, 3.8, [-0.5, 1.55, 0.65], colors.chrome);
  shaft.rotation.z = Math.PI / 2;
  const stringingHead = makeLacrosseHead(colors.tuftsBlue);
  stringingHead.position.set(-1.5, 1.6, -0.4);
  stringingHead.rotation.z = Math.PI / 2;
  stringingHead.scale.setScalar(0.65);
  workshop.add(stringingHead);

  // --- fill: gear bench with helmets and pads, water cooler, hanging banners ---
  table(parent, [0, 0, z + 8], [4.4, 1.2], colors.tuftsBrown);
  for (let i = 0; i < 3; i += 1) {
    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6),
      new THREE.MeshStandardMaterial({ color: colors.white, roughness: 0.35 }),
    );
    helmet.position.set(-1.4 + i * 1.4, 1.55, z + 8);
    parent.add(helmet);
    box(parent, [0.9, 0.5, 0.5], [-1.4 + i * 1.4, 1.45, z + 8.4], [colors.tuftsBlue, colors.red, colors.yellow][i]);
  }
  const cooler = cylinder(parent, 0.35, 1.4, [-6.0, 0.7, z + 9], colors.tuftsBlue, 16);
  cylinder(parent, 0.3, 0.2, [-6.0, 1.5, z + 9], colors.white);
  for (const bx of [-2.5, 2.5]) {
    box(parent, [2.0, 3.0, 0.1], [bx, 5.0, z - 10.6], bx < 0 ? colors.tuftsBlue : colors.red, {
      emissive: bx < 0 ? colors.tuftsBlue : colors.red,
      emissiveIntensity: 0.18,
    });
  }

  let printProgress = 0;
  return {
    colliders: [
      blocker(-6.25, z - 0.75, 0.85, 7.5), // left locker run
      blocker(6.25, z - 0.75, 0.85, 7.5),  // right locker run
      blocker(0, z - 6.7, 4.6, 0.9),       // trophy plinths
      blocker(0, z + 8, 2.2, 0.7),         // gear bench
      blocker(-6.0, z + 9, 0.4, 0.4),      // water cooler
      blocker(-4.1, z + 4.7, 1.9, 1.2),    // culture table
      blocker(3.85, z + 4.4, 2.2, 1.4),    // workshop + printer
      blocker(6.2, z + 7.5, 0.6, 1.1),     // shelf
    ],
    animated: [
      (elapsed) => {
        if (printProgress <= 0) return;
        printHead.position.x = Math.sin(elapsed * 4.8) * 1.05;
        printHead.position.z = Math.cos(elapsed * 3.1) * 0.58;
        printProgress = Math.min(1, printProgress + 0.004);
        printedHead.scale.setScalar(Math.max(0.01, printProgress));
      },
    ],
    steps: [
      {
        id: "lacrosse-trophies",
        chapter: "lacrosse",
        order: 0,
        title: "Remember the standard",
        prompt: "Lift the center championship trophy",
        dossier: "lacrosse",
        objective: "Walk the 2024, 2025, and 2026 championship gallery",
        detail: "Three consecutive championships represent thousands of ordinary repetitions completed together.",
        position: new THREE.Vector3(0, 2.2, z - 5.8),
        object: trophies[1],
        activate: () => trophies.forEach((item, index) => item.rotation.y = (index - 1) * 0.08),
      },
      {
        id: "lacrosse-culture",
        chapter: "lacrosse",
        order: 1,
        title: "Build the team around the team",
        prompt: "Open the latest team newspaper",
        link: "https://www.theheadstrongfoundation.org",
        objective: "Explore the leadership table",
        detail: "The Daily ’Cac, peer support, youth coaching, Bronx Lacrosse, and HEADstrong expand leadership beyond game day.",
        position: new THREE.Vector3(-4.1, 1.7, z + 4),
        object: cultureTable,
        activate: () => coachingBoard.rotation.z = -0.025,
      },
      {
        id: "lacrosse-cad",
        chapter: "lacrosse",
        order: 2,
        title: "Load the design",
        prompt: "Rotate and slice the lacrosse-head CAD model",
        objective: "Prepare the custom head for printing",
        detail: "Athletic experience becomes design input: scoop geometry, sidewall structure, pocket placement, and manufacturability — the same SolidWorks discipline that redesigned Helfrich's welding fixtures, pointed at my own sport.",
        position: new THREE.Vector3(5.8, 3.1, z + 8),
        object: cadPanel,
        activate: () => printHead.position.y = 2.35,
      },
      {
        id: "lacrosse-print",
        chapter: "lacrosse",
        order: 3,
        title: "Print the head",
        prompt: "Start the printer’s first layer",
        objective: "Print the lacrosse head layer by layer",
        detail: "The digital model becomes a physical prototype surrounded by failed iterations, measurement tools, and stringing supplies.",
        position: new THREE.Vector3(3.8, 2.2, z + 3.8),
        object: printer,
        activate: () => { printProgress = 0.02; },
      },
      {
        id: "lacrosse-assemble",
        chapter: "lacrosse",
        order: 4,
        title: "Finish the stick",
        prompt: "String the pocket and mount the printed head",
        objective: "Assemble the new head and carry it to Bello Field",
        detail: "The project is complete only when the object enters a player’s hands and survives real use.",
        position: new THREE.Vector3(3.4, 1.7, z + 4.5),
        object: workshop,
        activate: () => {
          printedHead.scale.setScalar(0.72);
          printedHead.position.set(1.45, 1.65, 0.65);
          printedHead.rotation.z = Math.PI / 2;
          workshop.add(printedHead);
        },
      },
      {
        id: "lacrosse-cooler-note",
        chapter: "lacrosse",
        order: 9,
        title: "The fourth-quarter note",
        prompt: "Pull the folded note from behind the cooler",
        objective: "Find the team’s smallest ritual",
        detail: "The note says: notice who has gone quiet. Systems fail at the edges before they fail in public.",
        position: new THREE.Vector3(-5.6, 1.1, z + 9),
        object: cooler,
        optional: true,
        secret: true,
        activate: () => cooler.scale.set(1.08, .94, 1.08),
      },
    ],
  };
}

export function buildField(parent: THREE.Group, chapter: ChapterDefinition): ChapterResult {
  const { z } = chapter;
  floor(parent, [22, 34], [0, -0.16, z - 3], 0x2f7f56);
  for (const x of [-6, 0, 6]) box(parent, [0.08, 0.03, 32], [x, 0, z - 3], colors.white);
  for (let zz = -15; zz <= 15; zz += 5) box(parent, [20, 0.03, 0.08], [0, 0, z + zz - 3], colors.white);
  const goal = new THREE.Group();
  goal.position.set(0, 0, z - 13);
  parent.add(goal);
  for (const x of [-1.8, 1.8]) cylinder(goal, 0.08, 3.6, [x, 1.8, 0], colors.orange);
  box(goal, [3.7, 0.12, 0.12], [0, 3.55, 0], colors.orange);
  for (const side of [-1, 1]) {
    for (let row = 0; row < 4; row += 1) {
      box(parent, [3.2, 0.45, 18], [side * (9 + row * 0.9), 0.35 + row * 0.55, z - 3], colors.tuftsBrown);
    }
  }
  sign(parent, "BELLO FIELD", "THE WORK HAS TO SURVIVE REAL USE", [0, 5.4, z - 16], "#3e8ede", "#fff9e9", "#5f4638", [6.4, 2]);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), new THREE.MeshStandardMaterial({ color: colors.white }));
  ball.position.set(0, 1.3, z + 4);
  parent.add(ball);
  spotlight(parent, colors.white, [-8, 11, z], [0, 0, z - 7], 150);
  spotlight(parent, colors.white, [8, 11, z], [0, 0, z - 7], 150);

  return {
    entry: [0, 1.72, z + 5],
    bounds: { minX: -6.45, maxX: 6.45, minZ: z - 15, maxZ: z + 7 },
    colliders: [
      blocker(0, z - 13, 2.0, 0.3), // goal
    ],
    animated: [],
    steps: [
      {
        id: "field-shot",
        chapter: "field",
        order: 0,
        title: "Test it under pressure",
        prompt: "Load the ball and take the final shot",
        objective: "Test the finished stick on Bello Field",
        detail: "Engineering, product design, athletics, leadership, and craft meet in one final requirement: the work has to function for a person.",
        position: new THREE.Vector3(0, 1.3, z + 4),
        object: ball,
        activate: () => {
          ball.position.set(0, 2.4, z - 12.7);
          ball.scale.setScalar(1.3);
        },
      },
    ],
  };
}
