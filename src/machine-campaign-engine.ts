import { machineCases } from "./machine-campaign-data";
import type {
  CampaignSave,
  CaseDecision,
  CaseId,
  CaseResult,
  MachineCase,
} from "./machine-campaign-types";

export const CAMPAIGN_STORAGE_KEY = "josiah-machine-campaign-v2";

export function newCampaign(): CampaignSave {
  return {
    activeCase: machineCases[0].id,
    completed: {},
    collectedEvidence: {},
    equipped: [],
  };
}

export function availableCases(save: CampaignSave): CaseId[] {
  const completedCount = Object.keys(save.completed).length;
  return machineCases
    .filter((item) => item.order <= completedCount + 1 || Boolean(save.completed[item.id]))
    .map((item) => item.id);
}

export function canSubmitDecision(decision: CaseDecision, evidenceIds: string[]) {
  return decision.requiredEvidence.every((id) => evidenceIds.includes(id));
}

export function resolveCase(
  machineCase: MachineCase,
  decisionId: string,
  evidenceIds: string[],
): CaseResult {
  const decision = machineCase.decisions.find((item) => item.id === decisionId);
  if (!decision) throw new Error(`Unknown decision: ${decisionId}`);
  if (!canSubmitDecision(decision, evidenceIds)) {
    throw new Error("Required evidence has not been recovered.");
  }
  return {
    decisionId,
    evidenceIds: [...evidenceIds],
    score: { ...decision.score },
    best: decision.best,
  };
}

export function completeCase(
  save: CampaignSave,
  machineCase: MachineCase,
  result: CaseResult,
): CampaignSave {
  return {
    ...save,
    activeCase: machineCase.id,
    completed: { ...save.completed, [machineCase.id]: result },
    equipped: save.equipped.includes(machineCase.reward)
      ? save.equipped
      : [...save.equipped, machineCase.reward],
  };
}

export function campaignScore(save: CampaignSave) {
  const results = Object.values(save.completed).filter(Boolean) as CaseResult[];
  if (!results.length) return { judgment: 0, trust: 0, systems: 0, total: 0 };
  const sum = results.reduce(
    (acc, result) => ({
      judgment: acc.judgment + result.score.judgment,
      trust: acc.trust + result.score.trust,
      systems: acc.systems + result.score.systems,
    }),
    { judgment: 0, trust: 0, systems: 0 },
  );
  const judgment = Math.round(sum.judgment / results.length);
  const trust = Math.round(sum.trust / results.length);
  const systems = Math.round(sum.systems / results.length);
  return { judgment, trust, systems, total: Math.round((judgment + trust + systems) / 3) };
}
