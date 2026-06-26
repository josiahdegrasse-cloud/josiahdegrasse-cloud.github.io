import * as THREE from "three";
import { colors, material } from "./game-kit";
import type {
  ChapterDefinition,
  ChapterId,
  ChapterResult,
  Portal,
  RoomBounds,
  RoomBuild,
  StoryStep,
} from "./game-types";
import { portfolioProjects } from "./portfolio-data";
import { buildBedroom } from "./world-bedroom";
import { buildField, buildLacrosse } from "./world-lacrosse";
import { buildNfi, buildRedHat } from "./world-studios";
import { buildHeadTap, buildHelfrich } from "./world-workrooms";
import { buildRooftop } from "./world-rooftop";

const project = (id: string) => portfolioProjects.find((item) => item.id === id);

export const chapters: ChapterDefinition[] = [
  {
    id: "recovery",
    title: "Josiah’s Bedroom",
    shortTitle: "Bedroom",
    subtitle: "The hub — every object opens a memory",
    z: 0,
    accent: colors.red,
  },
  {
    id: "helfrich",
    title: "Helfrich Works",
    shortTitle: "Helfrich",
    subtitle: "Design the production system",
    z: 0,
    accent: colors.orange,
    project: project("helfrich"),
  },
  {
    id: "headtap",
    title: "HeadTap Social Club",
    shortTitle: "HeadTap",
    subtitle: "Connect taste to place",
    z: 0,
    accent: colors.pink,
    project: project("headtap"),
  },
  {
    id: "nfi",
    title: "New Food Innovation Lab",
    shortTitle: "New Food Innovation",
    subtitle: "Turn evidence into a decision",
    z: 0,
    accent: colors.green,
    project: project("nfi"),
  },
  {
    id: "red-hat",
    title: "Red Hat Open Innovation Studio",
    shortTitle: "Red Hat",
    subtitle: "Make AI assistance trustworthy",
    z: 0,
    accent: colors.red,
    project: project("red-hat"),
  },
  {
    id: "lacrosse",
    title: "Championship Locker Hall",
    shortTitle: "Lacrosse",
    subtitle: "Build the team and the equipment",
    z: 0,
    accent: colors.yellow,
    project: project("lacrosse"),
  },
  {
    id: "field",
    title: "The Championship Field",
    shortTitle: "Final Field",
    subtitle: "Test the work under pressure",
    z: 0,
    accent: colors.white,
  },
  {
    // Secret room — not listed in the hub/map; reached only by climbing.
    id: "rooftop",
    title: "The Front Yard Glade",
    shortTitle: "Outside",
    subtitle: "A secret window escape, a suspicious road, and mountains that accept tiny cars",
    z: 0,
    accent: colors.yellow,
  },
];

/** The hub plus the rooms reachable from it (the secret rooftop is excluded). */
export const HUB_ID: ChapterId = "recovery";
const HIDDEN_CHAPTERS: ChapterId[] = ["rooftop"];
export const destinationChapters = chapters.filter(
  (chapter) => chapter.id !== HUB_ID && !HIDDEN_CHAPTERS.includes(chapter.id),
);

type RoomBuilder = (
  group: THREE.Group,
  chapter: ChapterDefinition,
  completedRooms: Set<ChapterId>,
) => ChapterResult;

const builders: Record<ChapterId, RoomBuilder> = {
  recovery: buildBedroom,
  helfrich: buildHelfrich,
  headtap: buildHeadTap,
  nfi: buildNfi,
  "red-hat": buildRedHat,
  lacrosse: buildLacrosse,
  field: buildField,
  rooftop: buildRooftop,
};

const DEFAULT_BOUNDS: RoomBounds = { minX: -6.45, maxX: 6.45, minZ: -9.5, maxZ: 9.5 };
const DEFAULT_ENTRY: [number, number, number] = [0, 1.72, 7];

function addInteractionCue(parent: THREE.Object3D, position: THREE.Vector3, accent: number): THREE.Group {
  const cue = new THREE.Group();
  cue.position.copy(position);
  cue.position.y += 0.12;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.035, 8, 20),
    material(accent, { emissive: accent, emissiveIntensity: 1.2, roughness: 0.3 }),
  );
  ring.rotation.x = Math.PI / 2;
  cue.add(ring);
  const dot = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.075, 0),
    new THREE.MeshBasicMaterial({ color: colors.white }),
  );
  cue.add(dot);
  const pointer = new THREE.Mesh(
    new THREE.ConeGeometry(0.045, 0.12, 8),
    new THREE.MeshBasicMaterial({ color: accent }),
  );
  pointer.position.y = -0.24;
  pointer.rotation.z = Math.PI;
  cue.add(pointer);
  parent.add(cue);
  return cue;
}

/** A billboarded text label so each portal says where it goes. */
function makeLabel(text: string): THREE.Mesh {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (context) {
    context.font = "700 64px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 12;
    context.strokeStyle = "rgba(8,6,4,0.92)";
    context.strokeText(text, 320, 80);
    context.fillStyle = "#fff9e9";
    context.fillText(text, 320, 80);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const aspect = canvas.width / canvas.height;
  const height = 0.4;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(height * aspect, height),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false }),
  );
  label.renderOrder = 10;
  return label;
}

/** Portals get a taller, doorway-like beacon plus a name label so they read as "go here". */
function addPortalCue(parent: THREE.Object3D, position: THREE.Vector3, accent: number, label: string): THREE.Group {
  const cue = new THREE.Group();
  cue.position.copy(position);
  cue.position.y += 0.42;
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.06, 12, 30),
    material(accent, { emissive: accent, emissiveIntensity: 1.8, roughness: 0.2 }),
  );
  halo.rotation.x = Math.PI / 2;
  cue.add(halo);
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12),
    new THREE.MeshBasicMaterial({ color: colors.white }),
  );
  cue.add(core);
  const beam = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.55, 12),
    new THREE.MeshBasicMaterial({ color: colors.white, transparent: true, opacity: 0.85 }),
  );
  beam.position.y = 0.5;
  cue.add(beam);
  const nameTag = makeLabel(label);
  nameTag.position.y = 0.95;
  cue.add(nameTag);
  parent.add(cue);
  return cue;
}

function addHandoffRail(
  parent: THREE.Object3D,
  chapter: ChapterDefinition,
  completedRooms: Set<ChapterId>,
) {
  const rail = new THREE.Group();
  rail.name = "handoff-record-rail";
  const active = chapter.id === HUB_ID || completedRooms.has(chapter.id);
  const railColor = active ? chapter.accent : colors.steel;
  const railMaterial = material(railColor, {
    emissive: railColor,
    emissiveIntensity: active ? 0.55 : 0.08,
    metalness: 0.45,
    roughness: 0.32,
  });
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 18.5), railMaterial);
  spine.position.set(6.72, 5.45, 0);
  rail.add(spine);

  for (let index = 0; index < 6; index += 1) {
    const carrier = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.42, 0.06),
      material(index < completedRooms.size ? colors.white : 0xd7c9aa, {
        emissive: index < completedRooms.size ? chapter.accent : colors.ink,
        emissiveIntensity: index < completedRooms.size ? 0.24 : 0,
        roughness: 0.82,
      }),
    );
    carrier.position.set(6.64, 5.05, -7.5 + index * 3);
    carrier.rotation.y = Math.PI / 2;
    rail.add(carrier);
  }

  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 12, 8),
    new THREE.MeshBasicMaterial({ color: active ? colors.white : chapter.accent }),
  );
  pulse.position.set(6.72, 5.45, 7.8);
  rail.add(pulse);
  parent.add(rail);

  return (elapsed: number) => {
    pulse.position.z = 8.4 - ((elapsed * (active ? 2.3 : 0.8)) % 16.8);
    pulse.scale.setScalar(active ? 1 + Math.sin(elapsed * 5) * 0.22 : 0.7);
  };
}

/**
 * Build a single room into the scene at the origin and return everything the game loop needs.
 * Only one room is ever resident; the caller disposes the previous group before calling again.
 */
export function buildRoom(
  scene: THREE.Scene,
  id: ChapterId,
  completedRooms: Set<ChapterId>,
): RoomBuild {
  const chapter = chapters.find((item) => item.id === id) ?? chapters[0];
  const group = new THREE.Group();
  group.name = id;
  scene.add(group);

  const localChapter: ChapterDefinition = { ...chapter, z: 0 };
  const result = builders[id](group, localChapter, completedRooms);
  result.animated.push(addHandoffRail(group, chapter, completedRooms));

  // Solid (standard-material) meshes cast and receive soft shadows; emissive cues/labels/screens don't.
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const mat = object.material;
    const isStandard = Array.isArray(mat)
      ? mat.some((m) => (m as THREE.Material).type === "MeshStandardMaterial")
      : (mat as THREE.Material).type === "MeshStandardMaterial";
    if (isStandard) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  const steps: StoryStep[] = result.steps;
  steps.forEach((step) => {
    if (step.secret) return;
    step.cue = addInteractionCue(group, step.position, chapter.accent);
  });

  const portals: Portal[] = result.portals ?? [];
  portals.forEach((portal) => {
    const labelChapter = chapters.find((item) => item.id === portal.target);
    portal.cue = addPortalCue(group, portal.position, chapter.accent, labelChapter?.shortTitle ?? portal.title);
  });

  return {
    id,
    group,
    title: chapter.title,
    accent: chapter.accent,
    steps,
    portals,
    animated: result.animated,
    props: result.props ?? [],
    colliders: result.colliders ?? [],
    bounds: result.bounds ?? DEFAULT_BOUNDS,
    entry: result.entry ?? DEFAULT_ENTRY,
    bounce: result.bounce ?? null,
  };
}

/** Free all GPU resources for a room group and detach it from the scene. */
export function disposeRoom(scene: THREE.Scene, group: THREE.Group) {
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((item) => {
      const map = (item as THREE.MeshStandardMaterial).map;
      if (map) map.dispose();
      item.dispose();
    });
  });
  scene.remove(group);
}
