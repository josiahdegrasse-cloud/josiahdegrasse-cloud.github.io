import * as THREE from "three";
import {
  board,
  box,
  colors,
  cylinder,
  laptop,
  makeLacrosseHead,
  material,
  table,
} from "./game-kit";
import type { ChapterId, Collider, Portal, StoryStep } from "./game-types";

function makeCap(color: number) {
  const cap = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.27, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    material(color, { roughness: 0.5 }),
  );
  cap.add(dome);
  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.05, 20, 1, false, 0, Math.PI),
    material(color, { roughness: 0.5 }),
  );
  brim.position.set(0, 0.01, 0.24);
  cap.add(brim);
  return cap;
}

/**
 * The bedroom is the hub: six objects each open a different room. Returns the portals plus any
 * colliders for furniture introduced here. `door` is the existing bedroom door (reused as the
 * field portal). Coordinates are relative to the room origin (z is always 0 for a loaded room).
 */
export function addBedroomPortals(
  parent: THREE.Object3D,
  z: number,
  door: THREE.Object3D,
): { portals: Portal[]; colliders: Collider[] } {
  const portals: Portal[] = [];
  const colliders: Collider[] = [];

  // 1. Industrial drawing -> Helfrich (framed on the right wall).
  const drawing = board(parent, [5.28, 3.2, z - 1.0], [2.3, 1.8], colors.powder, -Math.PI / 2);
  portals.push({
    id: "portal-helfrich",
    target: "helfrich",
    title: "Helfrich Works",
    prompt: "Unroll the production drawing",
    position: new THREE.Vector3(4.5, 1.8, z - 1.0),
    object: drawing,
  });

  // 2. Record player -> HeadTap (on the record crate, left-back).
  const recordPlayer = new THREE.Group();
  recordPlayer.position.set(-3.4, 1.08, z - 4.1);
  parent.add(recordPlayer);
  box(recordPlayer, [2.05, 0.24, 1.55], [0, 0, 0], colors.walnut);
  box(recordPlayer, [1.9, 0.08, 1.38], [0, 0.15, 0], colors.ink);
  const portalRecord = cylinder(recordPlayer, 0.6, 0.06, [-0.25, 0.23, 0], colors.ink, 48);
  cylinder(recordPlayer, 0.12, 0.07, [-0.25, 0.27, 0], colors.pink, 20);
  const tonearm = box(recordPlayer, [0.09, 0.08, 0.82], [0.65, 0.28, -0.08], colors.chrome);
  tonearm.rotation.y = -0.24;
  cylinder(recordPlayer, 0.11, 0.12, [0.82, 0.26, 0.28], colors.chrome, 16);
  cylinder(recordPlayer, 0.07, 0.06, [0.72, 0.25, -0.55], colors.red, 12);
  const lid = box(recordPlayer, [1.95, 0.06, 1.3], [0, 0.83, -0.62], colors.powder, {
    transparent: true,
    opacity: 0.25,
  });
  lid.rotation.x = -1.08;
  for (const x of [-1.35, 1.35]) {
    const speaker = box(recordPlayer, [0.56, 0.85, 0.55], [x, 0.28, 0], colors.walnut);
    cylinder(speaker, 0.18, 0.04, [0, 0.1, 0.3], colors.ink, 24).rotation.x = Math.PI / 2;
  }
  portalRecord.userData.spin = true;
  portals.push({
    id: "portal-headtap",
    target: "headtap",
    title: "HeadTap Social Club",
    prompt: "Play the HeadTap record",
    position: new THREE.Vector3(-3.4, 1.6, z - 3.2),
    object: recordPlayer,
  });

  // 3. Laptop on a small desk -> New Food Innovation (making zone).
  const desk = table(parent, [3.35, 0, z - 4.2], [2.3, 1.2], colors.walnut);
  const portalLaptop = laptop(desk, [0, 1.34, 0], colors.green);
  portals.push({
    id: "portal-nfi",
    target: "nfi",
    title: "New Food Innovation Lab",
    prompt: "Wake the lab laptop",
    position: new THREE.Vector3(3.35, 1.6, z - 3.45),
    object: portalLaptop,
  });
  colliders.push({ minX: 2.35, maxX: 4.45, minZ: z - 4.85, maxZ: z - 3.5, top: 1.0 });

  // 4. Red cap -> Red Hat (resting on the window bench).
  const cap = makeCap(colors.red);
  cap.position.set(-4.7, 1.05, z + 2.6);
  parent.add(cap);
  portals.push({
    id: "portal-red-hat",
    target: "red-hat",
    title: "Red Hat Open Innovation Studio",
    prompt: "Pick up the Red Hat workshop cap",
    position: new THREE.Vector3(-4.0, 1.4, z + 2.6),
    object: cap,
  });

  // 5. Lacrosse stick -> Lacrosse (with the rest of the sports gear, front wall).
  const stickRack = new THREE.Group();
  stickRack.position.set(-4.4, 2.0, z + 6.45);
  parent.add(stickRack);
  cylinder(stickRack, 0.06, 3.4, [0, 0, 0], colors.chrome);
  const head = makeLacrosseHead(colors.tuftsBlue);
  head.position.set(0, 1.95, 0);
  head.scale.setScalar(0.5);
  stickRack.add(head);
  portals.push({
    id: "portal-lacrosse",
    target: "lacrosse",
    title: "Championship Locker Hall",
    prompt: "Take the lacrosse stick from the rack",
    position: new THREE.Vector3(-4.4, 1.9, z + 5.95),
    object: stickRack,
  });

  // 6. The bedroom door -> Bello Field.
  portals.push({
    id: "portal-field",
    target: "field",
    title: "Bello Field",
    prompt: "Open the doors to Bello Field",
    position: new THREE.Vector3(-4.6, 1.9, z - 1.7),
    object: door,
  });

  return { portals, colliders };
}

/**
 * A small console by the back wall holding real contact links — résumé PDF, LinkedIn, and email.
 * These read as ordinary objects; interacting opens the link in a new tab.
 */
export function addBedroomContact(
  parent: THREE.Object3D,
  z: number,
): { steps: StoryStep[]; colliders: Collider[] } {
  const rail = box(parent, [0.22, 0.16, 3.0], [-5.28, 1.55, z - 3.4], colors.walnut);
  const resume = box(parent, [0.08, 0.96, 0.72], [-5.19, 2.15, z - 4.25], colors.white);
  const phone = box(parent, [0.08, 0.74, 0.42], [-5.18, 2.05, z - 3.4], colors.tuftsBlue, {
    emissive: colors.tuftsBlue,
    emissiveIntensity: 0.35,
  });
  const card = box(parent, [0.08, 0.64, 0.42], [-5.17, 1.95, z - 2.55], colors.yellow);
  void rail;

  const steps: StoryStep[] = [
    {
      id: "bedroom-resume",
      chapter: "recovery",
      order: 0,
      title: "Résumé",
      prompt: "Open my résumé (PDF)",
      objective: "Read the one-page version",
      detail: "The whole story in one page.",
      position: new THREE.Vector3(-4.5, 2.0, z - 4.25),
      object: resume,
      link: "/josiah-degrasse-resume.pdf",
    },
    {
      id: "bedroom-linkedin",
      chapter: "recovery",
      order: 1,
      title: "LinkedIn",
      prompt: "Open my LinkedIn",
      objective: "Connect on LinkedIn",
      detail: "Let's connect.",
      position: new THREE.Vector3(-4.5, 1.9, z - 3.4),
      object: phone,
      link: "https://www.linkedin.com/in/josiahdegrasse",
    },
    {
      id: "bedroom-email",
      chapter: "recovery",
      order: 2,
      title: "Email",
      prompt: "Email me",
      objective: "Start a conversation",
      detail: "Josiah.deGrasse@tufts.edu",
      position: new THREE.Vector3(-4.5, 1.8, z - 2.55),
      object: card,
      link: "mailto:Josiah.deGrasse@tufts.edu?subject=Portfolio%20inquiry",
    },
  ];
  return { steps, colliders: [] };
}

/**
 * Each completed room leaves an artifact on a mantel against the back wall, so the hub fills up
 * as the player works through the story (the "transformed bedroom" payoff).
 */
export function addBedroomArtifacts(
  parent: THREE.Object3D,
  z: number,
  completedRooms: Set<ChapterId>,
) {
  const order: Array<[ChapterId, number]> = [
    ["helfrich", colors.orange],
    ["headtap", colors.pink],
    ["nfi", colors.green],
    ["red-hat", colors.red],
    ["lacrosse", colors.yellow],
    ["field", colors.white],
  ];
  const present = order.filter(([id]) => completedRooms.has(id));
  if (present.length === 0) return;
  box(parent, [4.8, 0.16, 0.5], [0, 2.2, z - 6.42], colors.walnut);
  present.forEach(([id, color], index) => {
    const x = -1.8 + index * 0.85;
    if (id === "helfrich") {
      const carrier = cylinder(parent, 0.27, 0.18, [x, 2.52, z - 6.42], color, 18);
      carrier.rotation.z = Math.PI / 2;
    } else if (id === "headtap") {
      const record = cylinder(parent, 0.28, 0.05, [x, 2.52, z - 6.42], colors.ink, 28);
      record.rotation.x = Math.PI / 2;
      cylinder(parent, 0.07, 0.06, [x, 2.54, z - 6.39], color, 16).rotation.x = Math.PI / 2;
    } else if (id === "nfi") {
      box(parent, [0.52, 0.7, 0.05], [x, 2.58, z - 6.38], colors.white, {
        emissive: color,
        emissiveIntensity: 0.22,
      }).rotation.z = -0.08;
    } else if (id === "red-hat") {
      const stamp = makeCap(color);
      stamp.position.set(x, 2.45, z - 6.4);
      stamp.scale.setScalar(0.85);
      parent.add(stamp);
    } else if (id === "lacrosse") {
      const head = makeLacrosseHead(color);
      head.position.set(x, 2.55, z - 6.4);
      head.rotation.z = -Math.PI / 2;
      head.scale.setScalar(0.24);
      parent.add(head);
    } else {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), material(color, {
        emissive: color,
        emissiveIntensity: 0.5,
      }));
      ball.position.set(x, 2.5, z - 6.4);
      parent.add(ball);
    }
  });
}
