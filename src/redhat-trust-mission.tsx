import { useState } from "react";
import { ArrowLeft, Check, GitCompare, RotateCcw, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { redHatPortfolioScenario } from "./portfolio-evidence";

type RedHatTrustMissionProps = {
  onClose: () => void;
  onComplete: (result: { choice: string; evidenceIds: string[] }) => void;
};

export function RedHatTrustMission({ onClose, onComplete }: RedHatTrustMissionProps) {
  const [inspected, setInspected] = useState<string[]>([]);
  const [selectedChange, setSelectedChange] = useState<string | null>(null);
  const unsafeSelected = selectedChange === redHatPortfolioScenario.unsafeChange.id;
  const ready = inspected.length === 2 && unsafeSelected;

  const markInspected = (id: string) => {
    setInspected((current) => current.includes(id) ? current : [...current, id]);
  };

  return (
    <section className="pqm pqrh" role="dialog" aria-modal="true" aria-labelledby="pqrh-title">
      <div className="pqm-shell">
        <header className="pqm-topbar">
          <div>
            <span>Red Hat · Trust control room</span>
            <h2 id="pqrh-title">Validate the assistant before execution</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close trust review"><X /></button>
        </header>

        <div className="pqrh-incident">
          <span>Active incident</span>
          <strong>{redHatPortfolioScenario.incident}</strong>
          <p>Compare the bounded and source-grounded paths, then reject the change that breaks least privilege.</p>
        </div>

        <div className="pqrh-compare">
          {([
            ["deterministic", redHatPortfolioScenario.deterministicPath],
            ["rag", redHatPortfolioScenario.ragPath],
          ] as const).map(([id, path]) => (
            <button
              type="button"
              key={id}
              className={inspected.includes(id) ? "is-inspected" : ""}
              onClick={() => markInspected(id)}
            >
              <header>
                <GitCompare />
                <span>{path.label}</span>
                {inspected.includes(id) && <Check />}
              </header>
              <p>{path.answer}</p>
              <footer>
                {path.sources.map((source) => <span key={source}>{source}</span>)}
              </footer>
            </button>
          ))}
        </div>

        <div className="pqrh-diff">
          <header>
            <div>
              <span>Proposed configuration diff</span>
              <h3>Choose the unsafe change</h3>
            </div>
            <strong>{inspected.length} / 2 paths inspected</strong>
          </header>
          {[redHatPortfolioScenario.safeChange, redHatPortfolioScenario.unsafeChange].map((change) => (
            <button
              type="button"
              key={change.id}
              className={selectedChange === change.id ? "is-selected" : ""}
              onClick={() => setSelectedChange(change.id)}
              aria-pressed={selectedChange === change.id}
            >
              {change.id === redHatPortfolioScenario.unsafeChange.id ? <ShieldAlert /> : <ShieldCheck />}
              <div>
                <strong>{change.label}</strong>
                <p>{change.reason}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="pqrh-verdict" aria-live="polite">
          {!selectedChange && "Inspect both paths, then select the change that should be rejected."}
          {selectedChange === redHatPortfolioScenario.safeChange.id && "This change is scoped and reversible. Keep it in the plan."}
          {unsafeSelected && "Correct. Roll back the cluster-wide privilege escalation and preserve the scoped fix."}
        </div>

        <footer className="pqm-actions">
          <button type="button" onClick={onClose}><ArrowLeft /> Return to the studio</button>
          <p>{ready ? "The reasoning trace is ready to sign." : "Source visibility comes before speed."}</p>
          <button
            className="pqm-approve"
            type="button"
            disabled={!ready}
            onClick={() => onComplete({
              choice: "reject-unsafe-change-and-rollback",
              evidenceIds: ["deployment-runbook-4.2", "service-account-diff", "registry-access-policy"],
            })}
          >
            <RotateCcw />
            Roll back and approve
          </button>
        </footer>
      </div>
    </section>
  );
}
