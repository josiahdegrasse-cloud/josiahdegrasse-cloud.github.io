import { sitePath } from "./site-path";
import "./headtap.css";

export function HeadTapCover() {
  return (
    <div className="headtap-cover">
      <div className="headtap-cover-top">
        <span>HeadTap / Live music discovery</span>
        <span>Independent product</span>
      </div>
      <div className="project-screen-pair">
        <img
          className="project-screen-primary"
          src={sitePath("/images/headtap/headtap-music-dna.jpg")}
          alt="HeadTap’s orange music profile with a sample listener personality, musical DNA, and library statistics."
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
        <img
          className="project-screen-detail"
          src={sitePath("/images/headtap/headtap-discovery.jpg")}
          alt="HeadTap’s updated concert cards with match explanations, save controls, and artist feedback. Sample events."
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="headtap-cover-open" aria-hidden="true">
        ↗
      </span>
    </div>
  );
}
