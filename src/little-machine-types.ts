export type RobotPartId =
  | "clamp-arms"
  | "sensory-scanner"
  | "diagnostic-module"
  | "radio-antenna"
  | "scoop-launcher"
  | "runner-kit"
  | "prediction-processor"
  | "navigation-compass"
  | "coffee-cell";

export type RobotSlot = "mobility" | "tool" | "sensor" | "utility";

export type RobotPart = {
  id: RobotPartId;
  name: string;
  shortName: string;
  slot: RobotSlot;
  origin: string;
  ability: string;
  description: string;
  position: [number, number];
  accent: number;
};

export type RobotLoadout = Record<RobotSlot, RobotPartId | null>;

export type LittleMachineHud = {
  speed: number;
  nearbyPart: RobotPart | null;
  nearbyDiscovery: Discovery | null;
  collected: RobotPartId[];
  loadout: RobotLoadout;
  charge: number;
  message: string | null;
};

export type Discovery = {
  id: string;
  title: string;
  subtitle: string;
  projectId?: string;
  position: [number, number];
};

