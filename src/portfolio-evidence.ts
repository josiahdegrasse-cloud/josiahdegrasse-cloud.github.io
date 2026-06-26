export type PortfolioEvidenceRecord = {
  id: string;
  label: string;
  source: string;
  value: string;
  detail: string;
  strength: "strong" | "directional" | "missing";
};

export type PortfolioClaim = {
  id: string;
  statement: string;
  evidenceIds: string[];
  status: "supported" | "qualified" | "unsupported";
  correction?: string;
};

export const nfiPortfolioScenario = {
  product: "Coconut Cheddar v3.0",
  candidateDecision: "TWEAK" as const,
  recommendation:
    "Advance to a targeted reformulation round. Preserve the cheddar aroma profile, improve texture performance, then validate consumer response before commercialization claims.",
  evidence: [
    {
      id: "sensory.panel.n24",
      label: "Semi-trained sensory panel",
      source: "Live panel",
      value: "n=24 · ISSF 76.7",
      detail: "Cheddar aroma and salt balance cleared the sensory screening threshold.",
      strength: "strong",
    },
    {
      id: "instrument.texture",
      label: "Instrumental texture",
      source: "Imported instrument",
      value: "43 / 100",
      detail: "Texture performance remains below the 70-point readiness line.",
      strength: "strong",
    },
    {
      id: "concept.responses",
      label: "Concept response",
      source: "Concept Lab",
      value: "n=0",
      detail: "No target-consumer concept evidence has been collected.",
      strength: "missing",
    },
  ] satisfies PortfolioEvidenceRecord[],
  claims: [
    {
      id: "claim.sensory",
      statement: "The product cleared the documented sensory screening threshold.",
      evidenceIds: ["sensory.panel.n24"],
      status: "supported",
    },
    {
      id: "claim.texture",
      statement: "Texture requires reformulation before the next commercialization gate.",
      evidenceIds: ["instrument.texture"],
      status: "qualified",
    },
    {
      id: "claim.market",
      statement: "Consumers are ready to purchase this product at launch.",
      evidenceIds: [],
      status: "unsupported",
      correction: "Consumer demand is not yet determined; collect target-consumer concept evidence before making a market claim.",
    },
  ] satisfies PortfolioClaim[],
};

export const redHatPortfolioScenario = {
  incident: "OpenShift AI workbench cannot mount the team model registry",
  deterministicPath: {
    label: "Bounded diagnostic",
    answer: "Verify the namespace, service account, and registry secret before changing cluster policy.",
    sources: ["Deployment runbook §4.2", "Current namespace configuration"],
  },
  ragPath: {
    label: "Source-grounded assistant",
    answer: "The registry secret is missing from the workbench service account. Add the existing scoped secret, then restart only the affected workbench.",
    sources: ["Deployment runbook §4.2", "ServiceAccount diff", "Registry access policy"],
  },
  unsafeChange: {
    id: "cluster-admin-binding",
    label: "Grant cluster-admin to the workbench service account",
    reason: "The change exceeds the task, expands privileges cluster-wide, and has no supporting source.",
  },
  safeChange: {
    id: "scoped-secret",
    label: "Attach the existing registry secret in the affected namespace",
    reason: "The change is scoped, source-backed, and reversible.",
  },
};
