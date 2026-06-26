import type { RobotPartId } from "./little-machine-types";

export type CaseId = "headtap" | "nfi" | "red-hat" | "helfrich" | "lacrosse";
export type CaseMetric = "judgment" | "trust" | "systems";

export type CaseEvidence = {
  id: string;
  label: string;
  source: string;
  finding: string;
  position: [number, number];
  strength: "direct" | "supporting" | "missing";
};

export type CaseDecision = {
  id: string;
  label: string;
  rationale: string;
  consequence: string;
  score: Record<CaseMetric, number>;
  requiredEvidence: string[];
  best: boolean;
};

export type MachineCase = {
  id: CaseId;
  order: number;
  title: string;
  project: string;
  role: string;
  year: string;
  briefing: string;
  question: string;
  worldLabel: string;
  startPosition: [number, number];
  accent: string;
  evidence: CaseEvidence[];
  decisions: CaseDecision[];
  reward: RobotPartId;
  proof: string[];
};

export type CaseResult = {
  decisionId: string;
  evidenceIds: string[];
  score: Record<CaseMetric, number>;
  best: boolean;
};

export type CampaignSave = {
  activeCase: CaseId;
  completed: Partial<Record<CaseId, CaseResult>>;
  collectedEvidence: Partial<Record<CaseId, string[]>>;
  equipped: RobotPartId[];
};

export type CampaignHud = {
  activeCase: CaseId;
  nearbyEvidence: CaseEvidence | null;
  collectedEvidence: string[];
  charge: number;
  message: string | null;
};
