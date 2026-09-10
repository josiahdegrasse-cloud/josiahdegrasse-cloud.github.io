import { GamePostcard } from "./game-postcard";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  DoorOpen,
  Eye,
  Menu,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  Wrench,
  X,
} from "lucide-react";
import { PortfolioGame, type GameHudState } from "./portfolio-game";
import { ProjectChapter } from "./project-chapter";
import { portfolioProjects, type PortfolioProject } from "./portfolio-data";
import { ENDING_SYNTHESIS, THESIS } from "./portfolio-story";
import { stopMusic } from "./portfolio-audio";
import { SnowboardGame } from "./snowboard-game";
import { BackgammonGame } from "./backgammon-game";
import { NfiEvidenceMission } from "./nfi-evidence-mission";
import { RedHatTrustMission } from "./redhat-trust-mission";
import { chapters } from "./portfolio-world-builder";
import "./portfolio-game.css";

type ActiveMission = { type: "nfi-evidence-review" | "redhat-trust-review"; stepId: string };
type ExploreMode = "guided" | "recruiter" | "wander";

const modeDetails: Record<ExploreMode, { title: string; label: string; description: string }> = {
  guided: {
    title: "Story Route",
    label: "The long way through",
    description: "Follow the recommended sequence and let each room hand a lesson to the next.",
  },
  recruiter: {
    title: "Quick Tour",
    label: "Proof within five minutes",
    description: "Use the building map freely and keep the notebook one click away.",
  },
  wander: {
    title: "Open Building",
    label: "Explore and find secrets",
    description: "All rooms, repeatable interactions, hidden games, and minimal visual guidance.",
  },
};

function readRememberedRooms() {
  try {
    const saved = JSON.parse(localStorage.getItem("josiah-portfolio-progress-v13") ?? "{}") as { rooms?: string[] };
    return new Set(saved.rooms ?? []);
  } catch {
    return new Set<string>();
  }
}

const initialHud: GameHudState = {
  prompt: null,
  room: "Josiah’s Bedroom",
  objective: "Choose a memory to step into",
  detail: null,
  completedSteps: 0,
  totalSteps: 0,
  chapterIndex: 0,
  chapterCount: 6,
  locked: true,
  wakePhase: "sleeping",
  mode: "hub",
  canReturn: false,
  companionNear: false,
};

const touchButtons: Array<[string, string, string]> = [
  ["KeyW", "▲", "Move forward"],
  ["KeyA", "◀", "Move left"],
  ["KeyS", "▼", "Move back"],
  ["KeyD", "▶", "Move right"],
];

/**
 * The bedroom "little world" — a first-person, explorable autobiography. Each
 * memory is a room; glowing objects open project chapters (the projected film
 * reel). This shell mounts the Three.js {@link PortfolioGame} and layers the
 * HUD, pause/notebook menus, project chapters, mini-games, and ending over it.
 */
export function BedroomWorldPage() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [menu, setMenu] = useState<"pause" | "notebook" | "settings" | "map" | "collection" | null>(null);
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [hud, setHud] = useState<GameHudState>(initialHud);
  const [sensitivity, setSensitivity] = useState(1);
  const [sound, setSound] = useState(false);
  const [invertY, setInvertY] = useState(false);
  const [markers, setMarkers] = useState(true);
  const [finished, setFinished] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [minigame, setMinigame] = useState<string | null>(null);
  const [mission, setMission] = useState<ActiveMission | null>(null);
  const [exploreMode, setExploreMode] = useState<ExploreMode>("guided");
  const [modePicker, setModePicker] = useState(false);
  const [rememberedRooms, setRememberedRooms] = useState<Set<string>>(readRememberedRooms);
  const [keepsakes, setKeepsakes] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("josiah-portfolio-keepsakes") ?? "[]") as string[]; }
    catch { return []; }
  });

  useEffect(() => {
    document.title = "Josiah deGrasse | The Long Way Through";
    const pointerLock = () => setPointerLocked(Boolean(document.pointerLockElement));
    document.addEventListener("pointerlockchange", pointerLock);
    return () => {
      document.title = "New Food Innovation";
      document.removeEventListener("pointerlockchange", pointerLock);
    };
  }, []);

  useEffect(() => {
    const refreshProgress = () => window.setTimeout(() => setRememberedRooms(readRememberedRooms()), 60);
    window.addEventListener("portfolio-step-complete", refreshProgress);
    return () => window.removeEventListener("portfolio-step-complete", refreshProgress);
  }, []);

  useEffect(() => {
    const collect = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setKeepsakes((current) => {
        const next = current.includes(id) ? current : [...current, id];
        localStorage.setItem("josiah-portfolio-keepsakes", JSON.stringify(next));
        return next;
      });
    };
    window.addEventListener("portfolio-keepsake", collect);
    return () => window.removeEventListener("portfolio-keepsake", collect);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.code !== "Escape" || project || !started || minigame || mission) return;
      setMenu((current) => (current ? null : "pause"));
      setPaused((current) => !current);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [project, started, minigame, mission]);

  useEffect(() => {
    const launch = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      document.exitPointerLock?.();
      setPaused(true);
      setMinigame(detail);
    };
    window.addEventListener("portfolio-minigame", launch);
    return () => window.removeEventListener("portfolio-minigame", launch);
  }, []);

  const begin = (mode: ExploreMode = exploreMode) => {
    setExploreMode(mode);
    setMarkers(mode !== "wander");
    setStarted(true);
    setPaused(false);
    setMenu(null);
    setModePicker(false);
  };

  const closeOverlay = () => {
    setMenu(null);
    setPaused(false);
  };

  const openProject = useCallback((nextProject: PortfolioProject) => {
    document.exitPointerLock?.();
    setMenu(null);
    setProject(nextProject);
    setPaused(true);
  }, []);

  const finishGame = useCallback(() => {
    document.exitPointerLock?.();
    setFinished(true);
    setPaused(true);
  }, []);

  const closeProject = () => {
    setProject(null);
    setPaused(false);
  };

  const moveProject = (direction: number) => {
    if (!project) return;
    const currentIndex = portfolioProjects.findIndex((item) => item.id === project.id);
    setProject(portfolioProjects[(currentIndex + direction + portfolioProjects.length) % portfolioProjects.length]);
  };

  const closeMinigame = () => {
    setMinigame(null);
    setPaused(false);
  };

  const openMission = useCallback((type: ActiveMission["type"], stepId: string) => {
    document.exitPointerLock?.();
    setPaused(true);
    setMission({ type, stepId });
  }, []);

  const closeMission = () => {
    setMission(null);
    setPaused(false);
  };

  const completeMission = (result: { choice: string; evidenceIds: string[] }) => {
    if (mission) {
      window.dispatchEvent(new CustomEvent("portfolio-mission-complete", {
        detail: { stepId: mission.stepId, choice: result.choice, evidenceIds: result.evidenceIds },
      }));
    }
    closeMission();
  };

  const virtualInput = (code: string, active: boolean) => {
    window.dispatchEvent(new CustomEvent("portfolio-game-input", { detail: { code, active } }));
  };

  const travelTo = (chapter: string) => {
    document.exitPointerLock?.();
    setMenu(null);
    setPaused(false);
    window.dispatchEvent(new CustomEvent("portfolio-travel", { detail: chapter }));
  };

  return (
    <main className="pq4-game">
      <PortfolioGame
        paused={!started || paused || Boolean(project) || finished || Boolean(minigame) || Boolean(mission)}
        sensitivity={sensitivity}
        invertY={invertY}
        showMarkers={markers}
        sound={sound}
        onHudChange={setHud}
        onOpenProject={openProject}
        onOpenMission={openMission}
        onFinish={finishGame}
      />

      <div className="pq4-film" aria-hidden="true" />
      <div className="pq4-letterbox pq4-letterbox-top" aria-hidden="true" />
      <div className="pq4-letterbox pq4-letterbox-bottom" aria-hidden="true" />

      {started && !finished && hud.wakePhase !== "awake" && (
        <div className={`pq4-wake pq4-wake-${hud.wakePhase}`} aria-live="polite">
          <div className="pq4-wake-eyelid pq4-wake-eyelid-top" />
          <div className="pq4-wake-eyelid pq4-wake-eyelid-bottom" />
          <p>
            {hud.wakePhase === "sleeping" && "Morning arrives before you do."}
            {hud.wakePhase === "stirring" && "A radiator clicks. The city is already moving."}
            {hud.wakePhase === "sitting" && "Coffee first."}
            {hud.wakePhase === "standing" && "Get up."}
          </p>
          <span className="pq4-wake-skip">Click or press any key to skip ahead</span>
        </div>
      )}

      {started && !finished && hud.wakePhase === "awake" && (
        <>
          <header className="pq4-hud">
            <div className="pq4-room">
              <span>You are in</span>
              <strong>{hud.room}</strong>
              <small>{hud.objective}</small>
            </div>
            <div className="pq4-hud-actions">
              <a className="pq4-portfolio-return" href="/">Portfolio <ArrowUpRight size={16} /></a>
              <GamePostcard room={hud.room} onPause={() => setPaused(true)} onResume={() => setPaused(false)} />
              <button
                type="button"
                onClick={() => {
                  document.exitPointerLock?.();
                  setRememberedRooms(readRememberedRooms());
                  setMenu("map");
                  setPaused(true);
                }}
              >
                <Compass aria-hidden="true" />
                Map
              </button>
              <button
                type="button"
                onClick={() => {
                  document.exitPointerLock?.();
                  setMenu("pause");
                  setPaused(true);
                }}
              >
                <Pause aria-hidden="true" />
                Pause
              </button>
            </div>
          </header>

          {hud.detail && <aside className="pq4-discovery">{hud.detail}</aside>}

          <div className="pq4-reticle" aria-hidden="true"><span /></div>
          {!pointerLocked && !paused && (
            <div className="pq4-capture">
              <MousePointer2 aria-hidden="true" />
              Click the world to look around
            </div>
          )}
          {hud.prompt && (
            <div className="pq4-interact">
              <kbd>E</kbd>
              <span>Interact: {hud.prompt}</span>
            </div>
          )}
          <div className="pq4-controls">
            <span><kbd>WASD</kbd> Move</span>
            <span><MousePointer2 /> Look</span>
            <span><kbd>E</kbd> Use</span>
            <span><kbd>Space</kbd> Jump</span>
            <span><kbd>F</kbd> Pet</span>
            <span><kbd>T</kbd> Treat</span>
            {hud.canReturn && <span><kbd>Q</kbd> Bedroom</span>}
          </div>

          <div className="pq4-touch" aria-label="Touch controls">
            <div>
              {touchButtons.map(([code, glyph, label]) => (
                <button
                  key={code}
                  type="button"
                  aria-label={label}
                  onPointerDown={() => virtualInput(code, true)}
                  onPointerUp={() => virtualInput(code, false)}
                  onPointerLeave={() => virtualInput(code, false)}
                >
                  {glyph}
                </button>
              ))}
            </div>
            <div>
              <button
                type="button"
                aria-label="Interact"
                onPointerDown={() => virtualInput("KeyE", true)}
                onPointerUp={() => virtualInput("KeyE", false)}
              >
                E
              </button>
              {hud.canReturn && (
                <button
                  type="button"
                  aria-label="Return to bedroom"
                  onPointerDown={() => virtualInput("KeyQ", true)}
                  onPointerUp={() => virtualInput("KeyQ", false)}
                >
                  Q
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {!started && (
        <section className="pq4-title">
          <a className="pq4-start-return" href="/">← Return to portfolio</a>
          <div className="pq4-title-copy">
            <p>A playable autobiography by Josiah deGrasse</p>
            <h1>
              The Long Way
              <span>Through</span>
            </h1>
            <blockquote>{THESIS}</blockquote>
            <p className="pq4-title-note">
              One bedroom, six memories — each the same verb in a different room: turn the mess into
              something a person can actually use.
            </p>
            <div>
              <button type="button" onClick={() => setModePicker(true)}>
                <DoorOpen aria-hidden="true" />
                Enter the building
              </button>
              <button
                type="button"
                onClick={() => {
                  setStarted(true);
                  setPaused(true);
                  setMenu("notebook");
                }}
              >
                <BookOpen aria-hidden="true" />
                Open the notebook
              </button>
            </div>
          </div>
          <aside>
            <BookOpen aria-hidden="true" />
            <strong>Seven spaces. One continuous story.</strong>
            <p>
              A bedroom of personal rituals, then manufacturing, music, food technology, enterprise
              AI, and the field where it started. The same verb, different rooms.
            </p>
          </aside>
        </section>
      )}

      {!started && modePicker && (
        <section className="pq4-overlay pq4-mode-overlay">
          <div className="pq4-menu pq4-mode-menu">
            <header>
              <div>
                <span>Choose how the building behaves</span>
                <h2>How do you want to explore?</h2>
              </div>
              <button type="button" onClick={() => setModePicker(false)} aria-label="Close mode picker"><X /></button>
            </header>
            <div className="pq4-mode-grid">
              {(Object.keys(modeDetails) as ExploreMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  className={exploreMode === mode ? "is-selected" : ""}
                  onClick={() => setExploreMode(mode)}
                >
                  {mode === "guided" && <Compass />}
                  {mode === "recruiter" && <Wrench />}
                  {mode === "wander" && <Sparkles />}
                  <span><strong>{modeDetails[mode].title}</strong><small>{modeDetails[mode].label}</small></span>
                  <p>{modeDetails[mode].description}</p>
                  {exploreMode === mode && <Check />}
                </button>
              ))}
            </div>
            <footer className="pq4-mode-footer">
              <button type="button" onClick={() => begin()}>Enter the building <DoorOpen /></button>
              <a href="/portfolio/case-studies">Skip directly to case studies <ArrowUpRight /></a>
            </footer>
          </div>
        </section>
      )}

      {menu && (
        <section className="pq4-overlay">
          <div className="pq4-menu">
            <header>
              <div>
                <span>The building is paused</span>
                <h2>{menu === "pause" ? "Intermission" : menu === "settings" ? "Controls" : menu === "map" ? "The building map" : menu === "collection" ? "Keepsake drawer" : "Josiah’s notebook"}</h2>
              </div>
              <button type="button" onClick={closeOverlay} aria-label="Close menu"><X /></button>
            </header>

            {menu === "pause" && (
              <div className="pq4-menu-actions">
                <button type="button" onClick={closeOverlay}><Play /> Return to the building</button>
                <button type="button" onClick={() => setMenu("map")}><Compass /> Open the building map</button>
                <button type="button" onClick={() => setMenu("collection")}><Sparkles /> Keepsake drawer ({keepsakes.length})</button>
                <button type="button" onClick={() => setMenu("notebook")}><BookOpen /> Open the notebook</button>
                <button type="button" onClick={() => setMenu("settings")}><Settings /> Adjust controls</button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("josiah-portfolio-progress-v13");
                    window.location.reload();
                  }}
                >
                  <RotateCcw /> Restart the story
                </button>
              </div>
            )}

            {menu === "map" && (
              <div className="pq4-building-map">
                <div className="pq4-map-intro">
                  <span>{modeDetails[exploreMode].title}</span>
                  <strong>{hud.chapterIndex} of {hud.chapterCount} rooms remembered</strong>
                  <p>
                    The map makes a compact building feel larger. Every destination has one
                    identity, one useful interaction, and something that returns to the bedroom.
                  </p>
                </div>
                <div className="pq4-map-grid">
                  {chapters.map((chapter, index) => {
                    const isBedroom = chapter.id === "recovery";
                    const completed = rememberedRooms.has(chapter.id);
                    return (
                      <button
                        type="button"
                        key={chapter.id}
                        className={`${isBedroom ? "is-bedroom" : ""} ${completed ? "is-remembered" : ""}`}
                        onClick={() => travelTo(chapter.id)}
                      >
                        <small>{isBedroom ? "HOME" : String(index).padStart(2, "0")}</small>
                        <strong>{chapter.title}</strong>
                        <span>{chapter.subtitle}</span>
                        <i>{completed ? "Remembered" : isBedroom ? "Return here" : "Enter room"}</i>
                        <ArrowUpRight />
                      </button>
                    );
                  })}
                </div>
                <div className="pq4-map-legend">
                  <Eye />
                  <p>
                    Hidden inside the building: a snowboard run, a backgammon table, Pepper,
                    contact objects, repeatable music, and process details that never appear on a résumé.
                  </p>
                  <button type="button" onClick={() => setMenu("notebook")}>Open proof notebook</button>
                </div>
              </div>
            )}

            {menu === "collection" && (
              <div className="pq4-collection">
                <p>Games and secrets leave memories. They are optional, persistent, and separate from résumé completion.</p>
                {[
                  ["snow-line", "Blue Snow Line", "Found the hidden downhill run."],
                  ["table-crown", "Table Crown", "Beat the bedroom backgammon bot."],
                  ["off-menu-record", "Off-menu Record", "Asked the HeadTap bar for the frequency it never advertises."],
                ].map(([id, title, description]) => (
                  <article key={id} className={keepsakes.includes(id) ? "is-found" : ""}>
                    <i>{keepsakes.includes(id) ? <Check /> : "?"}</i>
                    <div>
                      <strong>{keepsakes.includes(id) ? title : "Undiscovered keepsake"}</strong>
                      <p>{keepsakes.includes(id) ? description : "Something in the building still reacts to play."}</p>
                    </div>
                  </article>
                ))}
                <button type="button" onClick={() => setMenu("map")}>Return to the building map</button>
              </div>
            )}

            {menu === "settings" && (
              <div className="pq4-settings">
                <label>
                  Look sensitivity <strong>{sensitivity.toFixed(1)}</strong>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={sensitivity}
                    onChange={(event) => setSensitivity(Number(event.target.value))}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setSound((current) => {
                    if (current) stopMusic();
                    return !current;
                  })}
                >
                  {sound ? <Volume2 /> : <VolumeX />}
                  Sound {sound ? "on" : "off"}
                </button>
                <button type="button" onClick={() => setInvertY((current) => !current)}>
                  Invert look {invertY ? "on" : "off"}
                </button>
                <button type="button" onClick={() => setMarkers((current) => !current)}>
                  Guidance markers {markers ? "on" : "off"}
                </button>
                <p>Movement supports keyboard, mouse, touch, and gamepad. Progress saves automatically. Interface animation respects reduced-motion preferences.</p>
                <button type="button" onClick={() => setMenu("pause")}>Back to intermission</button>
              </div>
            )}

            {menu === "notebook" && (
              <div className="pq4-notebook">
                <div className="pq4-notebook-intro">
                  <span>Proof drawer</span>
                  <strong>Play is optional. Evidence is not.</strong>
                  <p>Open any project directly for role, tools, decisions, outcomes, and the complete case-study story.</p>
                </div>
                {portfolioProjects.map((item) => (
                  <button type="button" key={item.id} onClick={() => openProject(item)}>
                    <span>{item.year}</span>
                    <div>
                      <small>{item.subtitle}</small>
                      <strong>{item.title}</strong>
                    </div>
                    <ArrowUpRight />
                  </button>
                ))}
                <a href="/josiah-degrasse-design-resume.pdf" target="_blank" rel="noreferrer">
                  Open résumé <ArrowUpRight />
                </a>
                <a href="mailto:Josiah.deGrasse@tufts.edu?subject=Portfolio%20inquiry">
                  Contact Josiah <ArrowUpRight />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const next = exploreMode === "guided" ? "recruiter" : exploreMode === "recruiter" ? "wander" : "guided";
                    setExploreMode(next);
                    setMarkers(next !== "wander");
                  }}
                >
                  <span>MODE</span>
                  <div><small>Change exploration style</small><strong>{modeDetails[exploreMode].title}</strong></div>
                  <ArrowUpRight />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {project && (
        <ProjectChapter
          project={project}
          projectIndex={portfolioProjects.findIndex((item) => item.id === project.id)}
          projectCount={portfolioProjects.length}
          onClose={closeProject}
          onPrevious={() => moveProject(-1)}
          onNext={() => moveProject(1)}
        />
      )}

      {minigame === "snowboard" && <SnowboardGame onExit={closeMinigame} />}
      {minigame === "backgammon" && <BackgammonGame onExit={closeMinigame} />}

      {mission?.type === "nfi-evidence-review" && (
        <NfiEvidenceMission onClose={closeMission} onComplete={completeMission} />
      )}
      {mission?.type === "redhat-trust-review" && (
        <RedHatTrustMission onClose={closeMission} onComplete={completeMission} />
      )}

      {finished && (
        <section className="pq4-ending">
          <div>
            <span>The final shot landed</span>
            <h2>Nothing here was a separate life.</h2>
            <p>{ENDING_SYNTHESIS}</p>
            <div>
              <button type="button" onClick={() => { setFinished(false); setPaused(false); }}>
                <Play aria-hidden="true" />
                Keep exploring
              </button>
              <a href="/josiah-degrasse-design-resume.pdf" target="_blank" rel="noreferrer">
                Open résumé <ArrowUpRight aria-hidden="true" />
              </a>
              <a href="/portfolio/case-studies">
                Read the case studies <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      )}

      {!started && (
        <button
          type="button"
          className="pq4-notebook-button"
          onClick={() => { setStarted(true); setPaused(true); setMenu("notebook"); }}
        >
          <Menu aria-hidden="true" /> Notebook
        </button>
      )}
    </main>
  );
}
