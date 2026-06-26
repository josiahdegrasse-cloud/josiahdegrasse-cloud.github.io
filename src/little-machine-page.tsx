import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  BookOpen,
  Bot,
  Check,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Gauge,
  Menu,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  Settings,
  ShieldCheck,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { littleMachineSound } from "./little-machine-audio";
import { caseById, machineCases } from "./machine-campaign-data";
import {
  availableCases,
  CAMPAIGN_STORAGE_KEY,
  campaignScore,
  completeCase,
  newCampaign,
  resolveCase,
} from "./machine-campaign-engine";
import type {
  CampaignHud,
  CampaignSave,
  CaseDecision,
  CaseEvidence,
  CaseResult,
  MachineCase,
} from "./machine-campaign-types";
import "./little-machine.css";

const LittleMachineGame = lazy(() =>
  import("./little-machine-game").then((module) => ({ default: module.LittleMachineGame })),
);

type Screen = "intro" | "briefing" | "explore" | "decision" | "result" | "cases" | "settings";

const initialHud: CampaignHud = {
  activeCase: "headtap",
  nearbyEvidence: null,
  collectedEvidence: [],
  charge: 100,
  message: null,
};

function loadCampaign(): CampaignSave {
  try {
    const value = JSON.parse(localStorage.getItem(CAMPAIGN_STORAGE_KEY) ?? "null");
    if (value?.activeCase && value?.completed && value?.collectedEvidence) {
      return { ...newCampaign(), ...value };
    }
  } catch {
    // A malformed local save should never prevent entry.
  }
  return newCampaign();
}

export function LittleMachinePage() {
  const [save, setSave] = useState<CampaignSave>(loadCampaign);
  const [screen, setScreen] = useState<Screen>("intro");
  const [paused, setPaused] = useState(true);
  const [hud, setHud] = useState<CampaignHud>(initialHud);
  const [result, setResult] = useState<{ decision: CaseDecision; value: CaseResult } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [guided, setGuided] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">(() =>
    window.matchMedia("(pointer: coarse)").matches ? "low" : "high",
  );

  const activeCase = caseById.get(save.activeCase) ?? machineCases[0];
  const collected = save.collectedEvidence[activeCase.id] ?? [];
  const unlocked = availableCases(save);
  const score = useMemo(() => campaignScore(save), [save]);
  const campaignComplete = Object.keys(save.completed).length === machineCases.length;

  useEffect(() => {
    document.title = "Josiah deGrasse | The Little Machine";
    return () => { document.title = "New Food Innovation"; };
  }, []);

  useEffect(() => {
    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(save));
  }, [save]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.code !== "Escape" || screen === "intro") return;
      if (screen === "explore") {
        setScreen("cases");
        setPaused(true);
      } else {
        setScreen("explore");
        setPaused(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [screen]);

  const collectEvidence = useCallback((evidence: CaseEvidence) => {
    setSave((current) => {
      const existing = current.collectedEvidence[current.activeCase] ?? [];
      if (existing.includes(evidence.id)) return current;
      return {
        ...current,
        collectedEvidence: {
          ...current.collectedEvidence,
          [current.activeCase]: [...existing, evidence.id],
        },
      };
    });
  }, []);

  const openCase = (machineCase: MachineCase) => {
    if (!unlocked.includes(machineCase.id)) return;
    setSave((current) => ({ ...current, activeCase: machineCase.id }));
    setResult(null);
    setScreen(save.completed[machineCase.id] ? "explore" : "briefing");
    setPaused(true);
  };

  const submitDecision = (decision: CaseDecision) => {
    const value = resolveCase(activeCase, decision.id, collected);
    setResult({ decision, value });
    if (value.best) {
      setSave((current) => completeCase(current, activeCase, value));
      if (soundEnabled) littleMachineSound("part");
    } else if (soundEnabled) {
      littleMachineSound("bump");
    }
    setScreen("result");
    setPaused(true);
  };

  const virtualInput = (code: string, active = true) => {
    window.dispatchEvent(new CustomEvent("portfolio-game-input", { detail: { code, active } }));
  };

  return (
    <main className="lm lm-campaign">
      <Suspense fallback={<div className="lm-loading">Running system checks…</div>}>
        <LittleMachineGame
          paused={paused || screen !== "explore"}
          quality={quality}
          guided={guided}
          soundEnabled={soundEnabled}
          activeCase={activeCase.id}
          collectedEvidence={collected}
          equipped={save.equipped}
          onHudChange={setHud}
          onCollectEvidence={collectEvidence}
        />
      </Suspense>

      <div className="lm-vignette" aria-hidden="true" />
      <div className="lm-grain" aria-hidden="true" />

      {screen === "intro" && (
        <section className="lm-campaign-intro" aria-labelledby="campaign-title">
          <div className="lm-campaign-intro__signal" aria-hidden="true">
            <span />
            <i />
          </div>
          <div className="lm-campaign-intro__copy">
            <p>Five systems failed overnight. One small machine is still awake.</p>
            <h1 id="campaign-title">Find the evidence. Make the call.</h1>
            <blockquote>
              A playable portfolio about building AI products people can inspect, challenge,
              and trust when the obvious answer is wrong.
            </blockquote>
            <div>
              <button type="button" onClick={() => setScreen("briefing")}>
                <Play /> Begin case one
              </button>
              <a href="/portfolio/case-studies"><BookOpen /> Skip to case studies</a>
            </div>
          </div>
          <aside>
            <strong>Campaign progress</strong>
            <span>{Object.keys(save.completed).length} of {machineCases.length} cases resolved</span>
            <p>Your decisions persist. Every recovered system becomes part of the final engineering review.</p>
          </aside>
        </section>
      )}

      {screen === "explore" && (
        <>
          <header className="lm-case-hud">
            <button type="button" onClick={() => { setScreen("cases"); setPaused(true); }}>
              <Menu />
              <span>
                <small>Case {activeCase.order} of {machineCases.length}</small>
                <strong>{activeCase.title}</strong>
              </span>
            </button>
            <div className="lm-case-hud__status">
              <span>
                <ScanLine />
                <strong>{collected.length}/{activeCase.evidence.length}</strong>
                evidence
              </span>
              <span>
                <BatteryCharging />
                <strong>{hud.charge}%</strong>
              </span>
              <button type="button" onClick={() => { setScreen("cases"); setPaused(true); }} aria-label="Pause campaign">
                <Pause />
              </button>
            </div>
          </header>

          <aside className="lm-objective">
            <span>{activeCase.project}</span>
            <strong>{activeCase.question}</strong>
            <div>
              {activeCase.evidence.map((item) => (
                <i key={item.id} className={collected.includes(item.id) ? "is-found" : ""} />
              ))}
            </div>
          </aside>

          {hud.message && <aside className="lm-message" aria-live="polite">{hud.message}</aside>}

          {hud.nearbyEvidence && (
            <button type="button" className="lm-nearby lm-evidence-nearby" onClick={() => virtualInput("KeyE")}>
              <span>{hud.nearbyEvidence.source} · {hud.nearbyEvidence.strength} evidence</span>
              <strong>{hud.nearbyEvidence.label}</strong>
              <small><kbd>E</kbd> Recover evidence</small>
            </button>
          )}

          {collected.length === activeCase.evidence.length && (
            <button
              type="button"
              className="lm-open-decision"
              onClick={() => { setScreen("decision"); setPaused(true); }}
            >
              <ClipboardCheck />
              <span><small>Evidence chain complete</small><strong>Make the decision</strong></span>
              <ChevronRight />
            </button>
          )}

          <div className="lm-controls">
            <span><kbd>WASD</kbd> Move</span>
            <span><kbd>Shift</kbd> Boost</span>
            <span><kbd>Space</kbd> Hop</span>
            <span><kbd>E</kbd> Recover</span>
            <span><kbd>Esc</kbd> Cases</span>
          </div>

          <div className="lm-touch">
            <div>
              <button type="button" onPointerDown={() => virtualInput("KeyA")} onPointerUp={() => virtualInput("KeyA", false)}>←</button>
              <button type="button" onPointerDown={() => virtualInput("KeyD")} onPointerUp={() => virtualInput("KeyD", false)}>→</button>
            </div>
            <div>
              <button type="button" onPointerDown={() => virtualInput("KeyS")} onPointerUp={() => virtualInput("KeyS", false)}>Back</button>
              <button type="button" onPointerDown={() => virtualInput("KeyW")} onPointerUp={() => virtualInput("KeyW", false)}>Move</button>
            </div>
          </div>
        </>
      )}

      {screen === "briefing" && (
        <CampaignPanel className="lm-briefing" onClose={() => setScreen("intro")}>
          <span>Incoming case {activeCase.order} · {activeCase.worldLabel}</span>
          <h2>{activeCase.title}</h2>
          <p>{activeCase.briefing}</p>
          <blockquote>{activeCase.question}</blockquote>
          <div className="lm-proof-strip">
            {activeCase.proof.map((item) => <strong key={item}>{item}</strong>)}
          </div>
          <footer>
            <button type="button" onClick={() => { setScreen("explore"); setPaused(false); }}>
              Deploy the machine <ArrowRight />
            </button>
            <a href={`/portfolio/projects/${activeCase.id}`}>Read the project first</a>
          </footer>
        </CampaignPanel>
      )}

      {screen === "decision" && (
        <CampaignPanel className="lm-decision" onClose={() => { setScreen("explore"); setPaused(false); }}>
          <span>Decision console · {activeCase.project}</span>
          <h2>{activeCase.question}</h2>
          <div className="lm-evidence-ledger">
            {activeCase.evidence.map((item) => (
              <article key={item.id} className={collected.includes(item.id) ? "is-found" : ""}>
                <Check />
                <div><strong>{item.label}</strong><p>{item.finding}</p><small>{item.source}</small></div>
              </article>
            ))}
          </div>
          <div className="lm-decision-options">
            {activeCase.decisions.map((decision) => {
              const missing = decision.requiredEvidence.filter((id) => !collected.includes(id));
              return (
                <button
                  type="button"
                  key={decision.id}
                  disabled={missing.length > 0}
                  onClick={() => submitDecision(decision)}
                >
                  <span>{decision.label}</span>
                  <p>{decision.rationale}</p>
                  {missing.length > 0 && <small>Recover {missing.length} more source{missing.length > 1 ? "s" : ""}</small>}
                  <ChevronRight />
                </button>
              );
            })}
          </div>
        </CampaignPanel>
      )}

      {screen === "result" && result && (
        <CampaignPanel className={`lm-result ${result.value.best ? "is-best" : "is-failure"}`}>
          <span>{result.value.best ? "System recovered" : "Decision failed under review"}</span>
          <h2>{result.decision.label}</h2>
          <p>{result.decision.consequence}</p>
          <div className="lm-score">
            <Score label="Judgment" value={result.value.score.judgment} icon={Eye} />
            <Score label="Trust" value={result.value.score.trust} icon={ShieldCheck} />
            <Score label="Systems" value={result.value.score.systems} icon={Gauge} />
          </div>
          {result.value.best ? (
            <>
              <div className="lm-reward">
                <Bot />
                <span><small>Machine upgrade recovered</small><strong>{activeCase.reward.replace(/-/g, " ")}</strong></span>
              </div>
              <footer>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    const next = machineCases.find((item) => item.order === activeCase.order + 1);
                    if (!next || campaignComplete) {
                      setScreen("cases");
                    } else {
                      setSave((current) => ({ ...current, activeCase: next.id }));
                      setScreen("briefing");
                    }
                  }}
                >
                  {campaignComplete ? "Open final review" : "Continue campaign"} <ArrowRight />
                </button>
                <a href={`/portfolio/projects/${activeCase.id}`}>Inspect the full case study</a>
              </footer>
            </>
          ) : (
            <footer>
              <button type="button" onClick={() => setScreen("decision")}>
                Revise the decision <RotateCcw />
              </button>
              <button type="button" onClick={() => { setScreen("explore"); setPaused(false); }}>
                Reinspect the system
              </button>
            </footer>
          )}
        </CampaignPanel>
      )}

      {(screen === "cases" || screen === "settings") && (
        <CampaignPanel className="lm-case-menu" onClose={() => { setScreen("explore"); setPaused(false); }}>
          {screen === "cases" ? (
            <>
              <span>Campaign control</span>
              <h2>{campaignComplete ? "Engineering review complete" : "Choose a live case"}</h2>
              {campaignComplete && (
                <div className="lm-final-review">
                  <p>Five different systems, one consistent practice: inspect the evidence, expose the tradeoff, and leave a safe path back.</p>
                  <div className="lm-score">
                    <Score label="Judgment" value={score.judgment} icon={Eye} />
                    <Score label="Trust" value={score.trust} icon={ShieldCheck} />
                    <Score label="Systems" value={score.systems} icon={Gauge} />
                  </div>
                  <a href="mailto:Josiah.deGrasse@tufts.edu?subject=The%20Little%20Machine">Interview the engineer <ArrowRight /></a>
                </div>
              )}
              <div className="lm-case-list">
                {machineCases.map((item) => {
                  const isUnlocked = unlocked.includes(item.id);
                  const completed = save.completed[item.id];
                  return (
                    <button type="button" key={item.id} disabled={!isUnlocked} onClick={() => openCase(item)}>
                      <span>{String(item.order).padStart(2, "0")}</span>
                      <div><small>{item.project}</small><strong>{item.title}</strong></div>
                      {completed ? <Check /> : isUnlocked ? <Play /> : <ShieldCheck />}
                    </button>
                  );
                })}
              </div>
              <footer>
                <button type="button" onClick={() => setScreen("settings")}><Settings /> Settings</button>
                <a href="/portfolio/case-studies"><BookOpen /> View case studies</a>
              </footer>
            </>
          ) : (
            <>
              <span>Machine settings</span>
              <h2>Field configuration</h2>
              <div className="lm-settings">
                <button type="button" onClick={() => setGuided((value) => !value)}><ScanLine /> Guidance signals: {guided ? "on" : "off"}</button>
                <button type="button" onClick={() => setSoundEnabled((value) => !value)}>
                  {soundEnabled ? <Volume2 /> : <VolumeX />} Robot sounds: {soundEnabled ? "on" : "off"}
                </button>
                <button type="button" onClick={() => setQuality((value) => value === "high" ? "low" : "high")}>
                  <Eye /> Visual quality: {quality}
                </button>
                <button type="button" onClick={() => setScreen("cases")}>Return to cases</button>
              </div>
            </>
          )}
        </CampaignPanel>
      )}

    </main>
  );
}

function CampaignPanel({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode;
  className: string;
  onClose?: () => void;
}) {
  return (
    <section className="lm-campaign-overlay" role="dialog" aria-modal="true">
      <div className={`lm-campaign-panel ${className}`}>
        {onClose && <button type="button" className="lm-panel-close" onClick={onClose} aria-label="Close"><X /></button>}
        {children}
      </div>
    </section>
  );
}

function Score({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Eye;
}) {
  return (
    <div>
      <Icon />
      <span>{label}</span>
      <strong>{value}</strong>
      <i><b style={{ width: `${value}%` }} /></i>
    </div>
  );
}
