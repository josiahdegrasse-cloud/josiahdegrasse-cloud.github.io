import type { ChapterId } from "./game-types";

export type PortfolioMode = "guided" | "explore" | "recruiter";
export type WorkflowStage = "purpose" | "precision" | "judgment" | "trust" | "relevance" | "execution";

export type HandoffArtifact = {
  inputStatus: "raw" | "calibrated";
  recommendationStatus: "missing" | "draft" | "revised";
  validationStatus: "unchecked" | "failed" | "approved";
  routeStatus: "unassigned" | "matched";
  executionStatus: "pending" | "complete";
};

export type PlayerDecision = {
  missionId: string;
  choice: string;
  recordedAt: string;
};

export type PortfolioWorldState = {
  version: 1;
  mode: PortfolioMode;
  currentStage: WorkflowStage;
  completedStages: WorkflowStage[];
  artifact: HandoffArtifact;
  decisions: PlayerDecision[];
  unlockedRooms: ChapterId[];
  discoveredEvidence: string[];
  endingUnlocked: boolean;
};

export type PortfolioWorldAction =
  | { type: "set-mode"; mode: PortfolioMode }
  | { type: "complete-mission"; missionId: string; choice: string; evidenceIds?: string[] }
  | { type: "reset" };

export const PORTFOLIO_WORLD_STORAGE_KEY = "josiah-portfolio-world-v1";

export const initialPortfolioWorldState: PortfolioWorldState = {
  version: 1,
  mode: "guided",
  currentStage: "purpose",
  completedStages: [],
  artifact: {
    inputStatus: "raw",
    recommendationStatus: "missing",
    validationStatus: "unchecked",
    routeStatus: "unassigned",
    executionStatus: "pending",
  },
  decisions: [],
  unlockedRooms: ["recovery", "helfrich"],
  discoveredEvidence: [],
  endingUnlocked: false,
};

type MissionTransition = {
  stage: WorkflowStage;
  nextStage: WorkflowStage;
  unlock: ChapterId;
  artifact: Partial<HandoffArtifact>;
};

const missionTransitions: Record<string, MissionTransition> = {
  "helfrich-run": {
    stage: "precision",
    nextStage: "judgment",
    unlock: "nfi",
    artifact: { inputStatus: "calibrated" },
  },
  "nfi-decide": {
    stage: "judgment",
    nextStage: "trust",
    unlock: "red-hat",
    artifact: { recommendationStatus: "revised", validationStatus: "failed" },
  },
  "redhat-rollback": {
    stage: "trust",
    nextStage: "relevance",
    unlock: "headtap",
    artifact: { validationStatus: "approved" },
  },
  "headtap-recommend": {
    stage: "relevance",
    nextStage: "execution",
    unlock: "lacrosse",
    artifact: { routeStatus: "matched" },
  },
  "lacrosse-assemble": {
    stage: "execution",
    nextStage: "execution",
    unlock: "field",
    artifact: {},
  },
  "field-shot": {
    stage: "execution",
    nextStage: "execution",
    unlock: "field",
    artifact: { executionStatus: "complete" },
  },
};

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function portfolioWorldReducer(
  state: PortfolioWorldState,
  action: PortfolioWorldAction,
): PortfolioWorldState {
  if (action.type === "reset") return initialPortfolioWorldState;
  if (action.type === "set-mode") return { ...state, mode: action.mode };

  const transition = missionTransitions[action.missionId];
  const decision: PlayerDecision = {
    missionId: action.missionId,
    choice: action.choice,
    recordedAt: new Date().toISOString(),
  };

  if (!transition) {
    return {
      ...state,
      decisions: [...state.decisions, decision],
      discoveredEvidence: unique([...state.discoveredEvidence, ...(action.evidenceIds ?? [])]),
    };
  }

  const completedStages = unique([...state.completedStages, transition.stage]);
  const executionComplete = transition.artifact.executionStatus === "complete";

  return {
    ...state,
    currentStage: transition.nextStage,
    completedStages,
    artifact: { ...state.artifact, ...transition.artifact },
    decisions: [...state.decisions, decision],
    unlockedRooms: unique([...state.unlockedRooms, transition.unlock]),
    discoveredEvidence: unique([...state.discoveredEvidence, ...(action.evidenceIds ?? [])]),
    endingUnlocked: state.endingUnlocked || executionComplete,
  };
}

export function readPortfolioWorldState(): PortfolioWorldState {
  try {
    const saved = JSON.parse(localStorage.getItem(PORTFOLIO_WORLD_STORAGE_KEY) ?? "null") as PortfolioWorldState | null;
    return saved?.version === 1 ? saved : initialPortfolioWorldState;
  } catch {
    return initialPortfolioWorldState;
  }
}

export function savePortfolioWorldState(state: PortfolioWorldState) {
  localStorage.setItem(PORTFOLIO_WORLD_STORAGE_KEY, JSON.stringify(state));
}
