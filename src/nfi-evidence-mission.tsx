import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, FileSearch, ShieldCheck, X } from "lucide-react";
import { nfiPortfolioScenario } from "./portfolio-evidence";

type NfiEvidenceMissionProps = {
  onClose: () => void;
  onComplete: (result: { choice: string; evidenceIds: string[] }) => void;
};

export function NfiEvidenceMission({ onClose, onComplete }: NfiEvidenceMissionProps) {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [inspectedEvidence, setInspectedEvidence] = useState<string[]>([]);
  const selectedClaim = useMemo(
    () => nfiPortfolioScenario.claims.find((claim) => claim.id === selectedClaimId),
    [selectedClaimId],
  );
  const unsupportedSelected = selectedClaim?.status === "unsupported";
  const ready = unsupportedSelected && inspectedEvidence.length >= 2;

  const inspectEvidence = (id: string) => {
    setInspectedEvidence((current) => current.includes(id) ? current : [...current, id]);
  };

  return (
    <section className="pqm" role="dialog" aria-modal="true" aria-labelledby="pqm-title">
      <div className="pqm-shell">
        <header className="pqm-topbar">
          <div>
            <span>New Food Innovation · Evidence engine</span>
            <h2 id="pqm-title">Review the AI recommendation</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close evidence review"><X /></button>
        </header>

        <div className="pqm-status">
          <div>
            <span>Candidate</span>
            <strong>{nfiPortfolioScenario.product}</strong>
          </div>
          <div>
            <span>Deterministic decision</span>
            <strong className="pqm-tweak">{nfiPortfolioScenario.candidateDecision}</strong>
          </div>
          <div>
            <span>Task</span>
            <strong>Remove the claim the evidence cannot support</strong>
          </div>
        </div>

        <div className="pqm-workspace">
          <aside className="pqm-evidence" aria-label="Evidence records">
            <header>
              <FileSearch />
              <div>
                <h3>Evidence</h3>
                <p>Inspect at least two source records.</p>
              </div>
            </header>
            {nfiPortfolioScenario.evidence.map((record) => {
              const inspected = inspectedEvidence.includes(record.id);
              return (
                <button
                  type="button"
                  className={`pqm-evidence-record pqm-strength-${record.strength}`}
                  key={record.id}
                  onClick={() => inspectEvidence(record.id)}
                  aria-pressed={inspected}
                >
                  <span>{record.source}</span>
                  <strong>{record.label}</strong>
                  <b>{record.value}</b>
                  <p>{record.detail}</p>
                  <small>{inspected ? <><Check /> Inspected</> : "Inspect source"}</small>
                </button>
              );
            })}
          </aside>

          <main className="pqm-claims">
            <header>
              <div>
                <span>AI draft · Human review required</span>
                <h3>Proposed report claims</h3>
              </div>
              <strong>{inspectedEvidence.length} / 2 sources inspected</strong>
            </header>
            <div className="pqm-recommendation">
              <span>Recommended action</span>
              <p>{nfiPortfolioScenario.recommendation}</p>
            </div>
            <div className="pqm-claim-list">
              {nfiPortfolioScenario.claims.map((claim) => (
                <button
                  type="button"
                  key={claim.id}
                  className={selectedClaimId === claim.id ? "is-selected" : ""}
                  onClick={() => setSelectedClaimId(claim.id)}
                  aria-pressed={selectedClaimId === claim.id}
                >
                  <span className={`pqm-claim-status pqm-claim-${claim.status}`}>
                    {claim.status === "unsupported" ? <AlertTriangle /> : <ShieldCheck />}
                    {claim.status}
                  </span>
                  <strong>{claim.statement}</strong>
                  <small>
                    {claim.evidenceIds.length > 0
                      ? `${claim.evidenceIds.length} linked evidence record${claim.evidenceIds.length > 1 ? "s" : ""}`
                      : "No evidence linked"}
                  </small>
                </button>
              ))}
            </div>

            <div className={`pqm-review-result ${selectedClaim ? "is-visible" : ""}`} aria-live="polite">
              {!selectedClaim && <p>Select the claim that exceeds the available evidence.</p>}
              {selectedClaim && selectedClaim.status !== "unsupported" && (
                <>
                  <strong>This claim stays.</strong>
                  <p>Its wording remains inside the scope of the linked evidence.</p>
                </>
              )}
              {selectedClaim?.status === "unsupported" && (
                <>
                  <strong>Unsupported claim found.</strong>
                  <p>{selectedClaim.correction}</p>
                </>
              )}
            </div>
          </main>
        </div>

        <footer className="pqm-actions">
          <button type="button" onClick={onClose}><ArrowLeft /> Return to the lab</button>
          <p>
            {!unsupportedSelected && "Find the unsupported market claim."}
            {unsupportedSelected && inspectedEvidence.length < 2 && "Inspect two evidence records before revising the draft."}
            {ready && "The evidence chain is ready for human approval."}
          </p>
          <button
            className="pqm-approve"
            type="button"
            disabled={!ready}
            onClick={() => onComplete({
              choice: "remove-unsupported-market-claim",
              evidenceIds: inspectedEvidence,
            })}
          >
            <ShieldCheck />
            Revise and approve
          </button>
        </footer>
      </div>
    </section>
  );
}

