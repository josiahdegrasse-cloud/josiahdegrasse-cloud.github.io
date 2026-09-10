import { useState } from "react";
import { BedroomWorldPage } from "./bedroom-world-page";
import { NfiEvidenceMission } from "./nfi-evidence-mission";
import { LittleMachinePage } from "./little-machine-page";

import { RedHatTrustMission } from "./redhat-trust-mission";
import "./portfolio-game.css";
import "./portfolio-recruiter.css";

type DirectMission = "nfi-evidence-review" | "redhat-trust-review";

export function PortfolioPage() {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  const recruiterProject = pathname.match(
    /^\/portfolio\/projects\/([^/]+)$/,
  )?.[1];
  const recruiterMode =
    pathname === "/portfolio/case-studies" || Boolean(recruiterProject);
  const missionQuery = new URLSearchParams(window.location.search).get(
    "mission",
  );
  const mission =
    missionQuery === "nfi-evidence-review" ||
    missionQuery === "redhat-trust-review"
      ? missionQuery
      : null;

  const world = new URLSearchParams(window.location.search).get("world");

  if (recruiterMode) {
    window.location.replace(
      recruiterProject ? `/work/${recruiterProject}` : "/",
    );
    return null;
  }
  if (mission) return <DirectMissionExperience mission={mission} />;
  if (world === "machine") return <LittleMachinePage />;
  if (world === "bedroom") return <BedroomWorldPage />;
  return <BedroomWorldPage />;
}

function DirectMissionExperience({ mission }: { mission: DirectMission }) {
  const [complete, setComplete] = useState(false);

  const finish = () => setComplete(true);
  const exit = () => {
    window.location.href =
      mission === "nfi-evidence-review"
        ? "/portfolio/projects/nfi"
        : "/portfolio/projects/red-hat";
  };

  if (complete) {
    return (
      <main className="pqm pqm-direct-complete">
        <section>
          <span>Evidence interaction complete</span>
          <h1>The system kept the human in control.</h1>
          <p>
            Return to the case study for the product decisions, architecture,
            and outcome behind this interaction.
          </p>
          <button type="button" onClick={exit}>
            Return to the case study
          </button>
        </section>
      </main>
    );
  }

  if (mission === "nfi-evidence-review") {
    return <NfiEvidenceMission onClose={exit} onComplete={finish} />;
  }
  return <RedHatTrustMission onClose={exit} onComplete={finish} />;
}
