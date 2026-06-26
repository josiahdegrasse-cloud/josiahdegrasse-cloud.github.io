import { describe, expect, it } from "vitest";
import { machineCases } from "./machine-campaign-data";
import {
  availableCases,
  campaignScore,
  canSubmitDecision,
  completeCase,
  newCampaign,
  resolveCase,
} from "./machine-campaign-engine";

describe("machine campaign", () => {
  it("unlocks one authored case at a time", () => {
    const save = newCampaign();
    expect(availableCases(save)).toEqual(["headtap"]);
    const machineCase = machineCases[0];
    const result = resolveCase(machineCase, "fit", ["taste", "distance", "venue"]);
    expect(availableCases(completeCase(save, machineCase, result))).toEqual(["headtap", "nfi"]);
  });

  it("requires the evidence claimed by a decision", () => {
    const decision = machineCases[1].decisions.find((item) => item.id === "tweak")!;
    expect(canSubmitDecision(decision, ["panel", "texture"])).toBe(false);
    expect(canSubmitDecision(decision, ["panel", "texture", "consumer"])).toBe(true);
  });

  it("records consequences and computes an aggregate profile", () => {
    let save = newCampaign();
    const first = machineCases[0];
    save = completeCase(save, first, resolveCase(first, "fit", ["taste", "distance", "venue"]));
    expect(save.equipped).toContain("radio-antenna");
    expect(campaignScore(save)).toEqual({ judgment: 92, trust: 86, systems: 88, total: 89 });
  });
});
