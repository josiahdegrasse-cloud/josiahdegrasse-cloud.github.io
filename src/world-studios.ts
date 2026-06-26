import * as THREE from "three";
import {
  blocker,
  board,
  box,
  chair,
  colors,
  couch,
  cylinder,
  floor,
  imagePanel,
  laptop,
  plant,
  shelf,
  sign,
  spotlight,
  table,
  wall,
} from "./game-kit";
import type { ChapterDefinition, ChapterResult } from "./game-types";

function cheeseBoard(parent: THREE.Object3D, position: [number, number, number], rotationY = 0) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.y = rotationY;
  parent.add(group);
  box(group, [2.2, 0.08, 1.3], [0, 0, 0], colors.walnut);
  const wedge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.28, 18, 1, false, 0, Math.PI * 0.58),
    new THREE.MeshStandardMaterial({ color: colors.cheese, roughness: 0.7 }),
  );
  wedge.rotation.x = Math.PI / 2;
  wedge.position.set(-0.48, 0.22, 0);
  group.add(wedge);
  for (let index = 0; index < 5; index += 1) {
    cylinder(group, 0.16, 0.12, [0.22 + index * 0.24, 0.12, -0.2 + (index % 2) * 0.35], index % 2 ? colors.white : colors.orange, 18);
  }
  return group;
}

function sensoryBooth(parent: THREE.Object3D, x: number, z: number, color: number) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  parent.add(group);
  box(group, [2.4, 0.18, 2.2], [0, 0.8, 0], colors.white);
  wall(group, [2.2, 2.5], [-1.15, 2, 0], colors.white, Math.PI / 2);
  wall(group, [2.2, 2.5], [1.15, 2, 0], colors.white, Math.PI / 2);
  box(group, [1.2, 0.08, 0.8], [0, 1.05, 0], colors.chrome);
  box(group, [0.8, 0.7, 0.05], [0, 1.7, -0.95], color, { emissive: color, emissiveIntensity: 0.3 });
  cylinder(group, 0.18, 0.32, [0, 1.3, 0], colors.white);
  return group;
}

export function buildNfi(parent: THREE.Group, chapter: ChapterDefinition): ChapterResult {
  const { z } = chapter;
  floor(parent, [15, 22], [0, -0.16, z], 0xd7dbd4);
  wall(parent, [22, 6.6], [-7.35, 3.1, z], colors.sage, Math.PI / 2);
  wall(parent, [22, 6.6], [7.35, 3.1, z], colors.white, Math.PI / 2);
  wall(parent, [15, 6.6], [0, 3.1, z - 10.9], colors.white);
  for (let offset = -9; offset <= 9; offset += 3) {
    box(parent, [13.8, 0.1, 0.1], [0, 5.7, z + offset], colors.chrome);
  }
  sign(parent, "NEW FOOD INNOVATION", "Taste sensing, sensory evidence, commercialization", [-3.6, 5.15, z - 10.65], "#fff9e9", "#174f3a", "#f47a31");
  imagePanel(parent, "/new_foodinnovation_ltd_logo.jpg", [5.7, 4, z - 10.65], [2.1, 2.1]);

  const developerTable = table(parent, [0, 0, z + 3.7], [7.8, 3.6], colors.white, colors.green);
  const workLaptop = laptop(developerTable, [-1.7, 1.52, 0], colors.green);
  chair(parent, [-1.7, 0, z + 6.2], colors.green, Math.PI);
  chair(parent, [1.5, 0, z + 6.2], colors.orange, Math.PI);
  const cheeseA = cheeseBoard(developerTable, [1.5, 1.48, -0.4]);
  cheeseBoard(developerTable, [1.5, 1.48, 0.9], 0.1);
  for (let index = 0; index < 6; index += 1) {
    cylinder(developerTable, 0.2, 0.38, [-3 + index * 0.58, 1.55, 1.1], colors.white);
    box(developerTable, [0.35, 0.22, 0.03], [-3 + index * 0.58, 1.82, 1.1], index % 2 ? colors.orange : colors.green);
  }

  const instrument = new THREE.Group();
  instrument.position.set(-4.8, 0, z - 4.2);
  parent.add(instrument);
  box(instrument, [3.4, 3.6, 2.4], [0, 1.8, 0], colors.white);
  box(instrument, [2.8, 1.35, 0.08], [0, 2.4, 1.23], colors.green, { emissive: colors.green, emissiveIntensity: 0.18 });
  for (let index = 0; index < 4; index += 1) {
    cylinder(instrument, 0.22, 0.7, [-0.9 + index * 0.6, 0.85, 1.25], colors.chrome);
  }
  sign(instrument, "TASTE SENSOR", "Instrumental evidence", [0, 3.25, 1.3], "#174f3a", "#fff9e9", "#f6c83f", [2.6, 0.75]);

  const booths = [
    sensoryBooth(parent, 2.5, z - 6.5, colors.red),
    sensoryBooth(parent, 5.2, z - 6.5, colors.blue),
    sensoryBooth(parent, 3.85, z - 3.7, colors.yellow),
  ];
  shelf(parent, [6, 0, z + 7.7], [2, 5, 1.2], colors.sage, 5);
  const decision = board(parent, [0, 3.3, z - 10.65], [4.8, 2.5], colors.green);
  sign(parent, "GO   TWEAK   STOP", "Evidence before claims", [0, 3.3, z - 10.58], "#174f3a", "#fff9e9", "#f6c83f", [4.5, 2.2]);
  plant(parent, [-6, 0, z + 8]);
  spotlight(parent, colors.white, [0, 6, z + 3.5], [0, 1, z + 3.5], 80);
  spotlight(parent, colors.yellow, [-4.7, 6, z - 4], [-4.7, 1, z - 4], 48);

  // --- fill: lab bench, glassware, fridge, wall charts ---
  table(parent, [-6.1, 0, z + 4], [1.4, 5.5], colors.white, colors.chrome);
  for (let i = 0; i < 6; i += 1) {
    cylinder(parent, 0.12, 0.3 + (i % 3) * 0.12, [-6.0, 1.45 + (i % 3) * 0.06, z + 2 + i * 0.7], [colors.green, colors.powder, colors.white][i % 3], 12);
  }
  const fridge = box(parent, [1.4, 3.2, 1.4], [6.2, 1.6, z - 2.5], colors.white, { metalness: 0.2 });
  box(parent, [1.0, 0.1, 0.9], [6.2, 3.25, z - 2.5], colors.chrome);
  board(parent, [7.05, 3.4, z + 2], [2.2, 1.6], colors.sage, -Math.PI / 2);
  board(parent, [-7.05, 3.4, z - 3], [2.0, 1.4], colors.powder, Math.PI / 2);

  return {
    colliders: [
      blocker(0, z + 3.7, 3.2, 1.6),    // developer table
      blocker(-4.8, z - 4.2, 1.8, 1.3), // taste-sensor instrument
      blocker(2.5, z - 6.5, 1.2, 1.1),  // sensory booth
      blocker(5.2, z - 6.5, 1.2, 1.1),  // sensory booth
      blocker(3.85, z - 3.7, 1.2, 1.1), // sensory booth
      blocker(6.0, z + 7.7, 0.7, 1.2),  // shelf
      blocker(-6.1, z + 4, 0.8, 2.8),   // lab bench
      blocker(6.2, z - 2.5, 0.8, 0.8),  // fridge
    ],
    animated: [],
    steps: [
      {
        id: "nfi-import",
        chapter: "nfi",
        order: 0,
        title: "Connect the instruments",
        prompt: "Import the instrument run on the lab laptop",
        link: "/",
        objective: "Load the instrumental evidence into the laptop",
        detail: "Machine data enters the same project as sensory responses, concepts, decisions, and the final commercialization report.",
        position: new THREE.Vector3(-1.7, 1.75, z + 3),
        object: workLaptop,
        activate: () => instrument.rotation.y = -0.04,
      },
      {
        id: "nfi-survey",
        chapter: "nfi",
        order: 1,
        title: "Design the tasting",
        prompt: "Place the coded samples on the tasting tray",
        dossier: "nfi",
        objective: "Prepare and approve the sensory test",
        detail: "Randomized sample codes, controlled booths, panelist assignments, and human review turn tasting into defensible evidence.",
        position: new THREE.Vector3(1.5, 1.7, z + 3.2),
        object: cheeseA,
        activate: () => booths.forEach((booth, index) => booth.rotation.y = (index - 1) * 0.04),
      },
      {
        id: "nfi-decide",
        chapter: "nfi",
        order: 2,
        title: "Make the call",
        prompt: "Open the GO / TWEAK / STOP review board",
        mission: "nfi-evidence-review",
        objective: "Turn the evidence into a GO, TWEAK, or STOP decision",
        detail: "The final recommendation preserves sample size, provenance, evidence strength, risk, and the next action — the same human-in-the-loop trust I designed into the Red Hat assistant, now deciding GO, TWEAK, or STOP.",
        position: new THREE.Vector3(0, 3, z - 9.8),
        object: decision,
        activate: () => decision.scale.set(1.04, 1.04, 1.04),
      },
      {
        id: "nfi-fridge-note",
        chapter: "nfi",
        order: 9,
        title: "The sample nobody launched",
        prompt: "Open the sample fridge’s rejected-iterations pocket",
        objective: "Find a rejected iteration",
        detail: "A failed sample is not wasted evidence. It narrows the design space and makes the next claim more honest.",
        position: new THREE.Vector3(5.7, 1.6, z - 2.5),
        object: fridge,
        optional: true,
        secret: true,
        activate: () => fridge.rotation.y = fridge.rotation.y === 0 ? -0.12 : 0,
      },
    ],
  };
}

function glassRoom(parent: THREE.Object3D, x: number, z: number) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  parent.add(group);
  const glass = new THREE.MeshStandardMaterial({
    color: 0xb7d9e8,
    transparent: true,
    opacity: 0.28,
    roughness: 0.08,
    metalness: 0.05,
  });
  for (const side of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.8, 5), glass);
    panel.position.set(side * 2.1, 2.4, 0);
    group.add(panel);
  }
  const back = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.8, 0.08), glass);
  back.position.set(0, 2.4, -2.5);
  group.add(back);
  return group;
}

export function buildRedHat(parent: THREE.Group, chapter: ChapterDefinition): ChapterResult {
  const { z } = chapter;
  floor(parent, [15, 22], [0, -0.16, z], colors.walnut);
  wall(parent, [22, 7], [-7.35, 3.35, z], colors.white, Math.PI / 2);
  wall(parent, [22, 7], [7.35, 3.35, z], colors.white, Math.PI / 2);
  wall(parent, [15, 7], [0, 3.35, z - 10.9], colors.charcoal);
  for (let offset = -9; offset <= 9; offset += 4) {
    box(parent, [14.5, 0.16, 0.16], [0, 6.2, z + offset], colors.charcoal);
  }
  sign(parent, "RED HAT", "OPEN INNOVATION STUDIO", [-4.5, 4.6, z - 10.65], "#d82f24", "#fff9e9", "#17130f", [4.5, 2.4]);

  glassRoom(parent, -4.7, z - 3.8);
  glassRoom(parent, 4.7, z - 3.8);
  const workshop = table(parent, [0, 0, z + 2], [8.2, 3], colors.walnut, colors.charcoal);
  const ragLaptop = laptop(workshop, [-2.4, 1.5, 0], colors.red);
  const rulesLaptop = laptop(workshop, [2.4, 1.5, 0], colors.white, Math.PI);
  for (const x of [-3.2, -1.1, 1.1, 3.2]) chair(parent, [x, 0, z + 4.5], x < 0 ? colors.red : colors.charcoal, Math.PI);
  const researchWall = board(parent, [-7.15, 3.2, z + 2], [7.4, 4.8], colors.white, Math.PI / 2);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      box(parent, [0.55, 0.55, 0.04], [-7.01, 1.8 + row * 0.85, z - 0.4 + col * 1.45], [colors.yellow, colors.pink, colors.powder, colors.white][(row + col) % 4]);
    }
  }
  const yamlWall = board(parent, [7.15, 3.1, z + 1], [6.6, 4.5], colors.charcoal, Math.PI / 2);
  for (let line = 0; line < 9; line += 1) {
    box(parent, [0.04, 0.16, 2.5 - (line % 3) * 0.35], [7.01, 4.65 - line * 0.38, z - 0.2 + (line % 2) * 0.55], line === 5 ? colors.red : colors.green);
  }
  couch(parent, [-4.5, 0, z + 8], colors.red);
  couch(parent, [4.5, 0, z + 8], colors.charcoal);
  plant(parent, [0, 0, z + 8.2]);
  const rollback = cylinder(workshop, 0.55, 0.22, [0, 1.55, 0], colors.red);
  const sourceCards = [ragLaptop, rulesLaptop, researchWall, yamlWall];
  spotlight(parent, colors.white, [0, 6.4, z + 2], [0, 1, z + 2], 75);
  spotlight(parent, colors.red, [-4.5, 6, z - 4], [-4.5, 1, z - 4], 42);

  // --- fill: standing desk + monitor, beanbags, plant, coffee cart ---
  table(parent, [-6.2, 0, z + 5], [1.4, 2.2], colors.charcoal, colors.ink);
  box(parent, [0.06, 0.8, 1.2], [-6.6, 2.1, z + 5], colors.powder, { emissive: colors.powder, emissiveIntensity: 0.3 });
  cylinder(parent, 0.55, 0.6, [-2.2, 0.3, z + 9.2], colors.red, 16);
  cylinder(parent, 0.55, 0.6, [2.2, 0.3, z + 9.2], colors.yellow, 16);
  plant(parent, [6.2, 0, z + 4.5]);
  const coffeeCart = box(parent, [1.0, 1.0, 0.7], [6.0, 0.5, z + 1], colors.charcoal);
  cylinder(parent, 0.16, 0.3, [6.0, 1.15, z + 1], colors.white);

  return {
    colliders: [
      blocker(0, z + 2, 3.0, 1.4),     // workshop table
      blocker(-4.7, z - 3.8, 2.1, 2.5), // glass meeting room
      blocker(4.7, z - 3.8, 2.1, 2.5),  // glass meeting room
      blocker(-4.5, z + 8, 1.6, 0.9),   // couch
      blocker(4.5, z + 8, 1.6, 0.9),    // couch
      blocker(-6.2, z + 5, 0.8, 1.2),   // standing desk
      blocker(6.0, z + 1, 0.7, 0.5),    // coffee cart
    ],
    animated: [],
    steps: [
      {
        id: "redhat-diagnose",
        chapter: "red-hat",
        order: 0,
        title: "Join the workshop",
        prompt: "Read the interview notes on the research wall",
        dossier: "red-hat",
        objective: "Diagnose where the deployment lost trust",
        detail: "The project begins in a collaborative workplace: interviews, journeys, configuration, and operator concerns all remain visible.",
        position: new THREE.Vector3(-6.3, 3, z + 2),
        object: researchWall,
        activate: () => researchWall.rotation.z = -0.02,
      },
      {
        id: "redhat-compare",
        chapter: "red-hat",
        order: 1,
        title: "Compare the assistants",
        prompt: "Run the same incident on both workshop terminals",
        objective: "Compare grounded and deterministic guidance",
        detail: "The two approaches reveal different strengths: flexible source-grounded help and predictable bounded control.",
        position: new THREE.Vector3(0, 1.8, z + 1.3),
        object: workshop,
        activate: () => sourceCards.forEach((item, index) => item.rotation.y += index % 2 ? -0.025 : 0.025),
      },
      {
        id: "redhat-rollback",
        chapter: "red-hat",
        order: 2,
        title: "Protect the operator",
        prompt: "Press the rollback control and inspect the YAML diff",
        mission: "redhat-trust-review",
        objective: "Inspect the YAML difference and restore control",
        detail: "Sources, configuration changes, approval, and rollback stay visible so speed never becomes a black box — the same gate that later anchors the New Food Innovation commercialization call.",
        position: new THREE.Vector3(0, 1.7, z + 2.8),
        object: rollback,
        activate: () => {
          rollback.scale.set(1.35, 0.55, 1.35);
          yamlWall.rotation.z = 0.025;
        },
      },
      {
        id: "redhat-coffee-runbook",
        chapter: "red-hat",
        order: 9,
        title: "The coffee-cart runbook",
        prompt: "Lift the runbook taped beneath the coffee cart",
        objective: "Find the unofficial recovery ritual",
        detail: "Before changing production: reproduce, read the source, show the diff, name the rollback owner, then make coffee.",
        position: new THREE.Vector3(5.5, 1.1, z + 1),
        object: coffeeCart,
        optional: true,
        secret: true,
        activate: () => coffeeCart.rotation.z = coffeeCart.rotation.z === 0 ? .04 : 0,
      },
    ],
  };
}
