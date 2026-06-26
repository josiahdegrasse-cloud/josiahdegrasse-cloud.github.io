import type * as THREE from "three";
import type { PortfolioProject } from "./portfolio-data";

export type ChapterId =
  | "recovery"
  | "helfrich"
  | "headtap"
  | "nfi"
  | "red-hat"
  | "lacrosse"
  | "field"
  | "rooftop";

export type GameHudState = {
  prompt: string | null;
  room: string;
  objective: string;
  detail: string | null;
  completedSteps: number;
  totalSteps: number;
  chapterIndex: number;
  chapterCount: number;
  locked: boolean;
  wakePhase: "sleeping" | "stirring" | "sitting" | "standing" | "awake";
  mode: "hub" | "room";
  canReturn: boolean;
  /** True when the player is within reach of the dog companion. */
  companionNear: boolean;
};

export type ChapterDefinition = {
  id: ChapterId;
  title: string;
  shortTitle: string;
  subtitle: string;
  z: number;
  accent: number;
  project?: PortfolioProject;
};

export type StoryStep = {
  id: string;
  chapter: ChapterId;
  order: number;
  title: string;
  prompt: string;
  objective: string;
  detail: string;
  position: THREE.Vector3;
  object: THREE.Object3D;
  cue?: THREE.Object3D;
  activate?: () => void;
  /** Opens an external URL in a new tab on use (e.g. the live product). */
  link?: string;
  /** Toggles the generative HeadTap music on use. */
  playsMusic?: boolean;
  /** Opens the full case-study dossier for this project id on use. */
  dossier?: string;
  /** Launches a hidden minigame overlay on use (e.g. "snowboard", "backgammon"). */
  minigame?: string;
  /** Optional discoveries never block room completion. */
  optional?: boolean;
  /** Secrets do not receive the standard floating guidance beacon. */
  secret?: boolean;
  /** Opens a product mission that must be completed before this step counts. */
  mission?: "nfi-evidence-review" | "redhat-trust-review";
};

export type Collider = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** Surface height you can stand on top of. Omitted = full-height wall (always blocks). */
  top?: number;
  /** Standing on this surface and jumping launches you sky-high (the bed). */
  bounce?: boolean;
};

export type RoomBounds = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

/** A doorway object in the hub that loads another room when used. */
export type Portal = {
  id: string;
  target: ChapterId;
  title: string;
  prompt: string;
  position: THREE.Vector3;
  object: THREE.Object3D;
  cue?: THREE.Object3D;
  /** Require the player to be standing at least this high above floor before proximity travel works. */
  minFeetY?: number;
};

/**
 * A plain, always-on interactable object in the room — no floating marker. Look
 * at it and a prompt appears; press E to act. Used to make every prop in the
 * room do something (toggle a lamp, open a window, pick up a board, etc.).
 */
export type RoomProp = {
  id: string;
  object: THREE.Object3D;
  prompt: string;
  position: THREE.Vector3;
  /** Carryable: E to pick up, E again to set it down where you're looking. */
  grabbable?: boolean;
  /** On/off prop (e.g. a lamp); receives the new state each press. */
  toggle?: (on: boolean) => void;
  /** Replayable one-shot action (e.g. open a window, water a plant). */
  activate?: () => void;
  /** Short line shown after interacting. */
  detail?: string;
  /** Skip the look-wobble / use-pop (for large furniture like the bed). */
  quiet?: boolean;
  /** Player-controllable vehicle mode. */
  vehicle?: {
    object: THREE.Object3D;
    wheels?: THREE.Object3D[];
    exhaust?: THREE.Object3D;
    cameraOffset?: THREE.Vector3;
  };
};

export type ChapterResult = {
  steps: StoryStep[];
  animated: Array<(elapsed: number, delta: number) => void>;
  colliders?: Collider[];
  portals?: Portal[];
  props?: RoomProp[];
  bounds?: RoomBounds;
  entry?: [number, number, number];
  /** XZ zone the player can jump on for a super-bounce (e.g. the bed). */
  bounce?: Collider;
};

/** A single room built into the scene on demand (hub-and-spoke model). */
export type RoomBuild = {
  id: ChapterId;
  group: THREE.Group;
  title: string;
  accent: number;
  steps: StoryStep[];
  portals: Portal[];
  props: RoomProp[];
  animated: Array<(elapsed: number, delta: number) => void>;
  colliders: Collider[];
  bounds: RoomBounds;
  entry: [number, number, number];
  /** XZ zone the player can jump on for a super-bounce (e.g. the bed). */
  bounce: Collider | null;
};
