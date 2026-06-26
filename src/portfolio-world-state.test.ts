import { describe, expect, it } from "vitest";
import { initialPortfolioWorldState, portfolioWorldReducer } from "./portfolio-world-state";

describe("portfolioWorldReducer", () => {
  it("calibrates the handoff record and unlocks the lab", () => {
    const state = portfolioWorldReducer(initialPortfolioWorldState, {
      type: "complete-mission",
      missionId: "helfrich-run",
      choice: "run-calibrated-fixture",
    });

    expect(state.artifact.inputStatus).toBe("calibrated");
    expect(state.currentStage).toBe("judgment");
    expect(state.unlockedRooms).toContain("nfi");
    expect(state.completedStages).toContain("precision");
  });

  it("carries a revised recommendation into trust review", () => {
    const state = portfolioWorldReducer(initialPortfolioWorldState, {
      type: "complete-mission",
      missionId: "nfi-decide",
      choice: "remove-unsupported-market-claim",
      evidenceIds: ["sensory.panel.n24", "instrument.texture"],
    });

    expect(state.artifact.recommendationStatus).toBe("revised");
    expect(state.artifact.validationStatus).toBe("failed");
    expect(state.discoveredEvidence).toEqual(["sensory.panel.n24", "instrument.texture"]);
    expect(state.unlockedRooms).toContain("red-hat");
  });

  it("unlocks the ending only after execution", () => {
    const state = portfolioWorldReducer(initialPortfolioWorldState, {
      type: "complete-mission",
      missionId: "field-shot",
      choice: "execute-validated-route",
    });

    expect(state.artifact.executionStatus).toBe("complete");
    expect(state.endingUnlocked).toBe(true);
  });

  it("records non-transition decisions without mutating the artifact", () => {
    const state = portfolioWorldReducer(initialPortfolioWorldState, {
      type: "complete-mission",
      missionId: "inspect-source",
      choice: "open-panel-evidence",
      evidenceIds: ["panel.response.summary"],
    });

    expect(state.artifact).toEqual(initialPortfolioWorldState.artifact);
    expect(state.decisions).toHaveLength(1);
    expect(state.discoveredEvidence).toEqual(["panel.response.summary"]);
  });
});

