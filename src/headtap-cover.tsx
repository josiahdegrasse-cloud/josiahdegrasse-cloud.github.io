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
          src={sitePath("/images/headtap/headtap-landing-supplied.png")}
          alt="HeadTap’s landing page introducing personalized concert discovery with Spotify connection and demo entry points."
          width={2630}
          height={1550}
          loading="lazy"
          decoding="async"
        />
        <img
          className="project-screen-detail"
          src={sitePath("/images/headtap/headtap-recommendations-fresh.jpg")}
          alt="HeadTap’s current sample recommendations with familiar artists, a fictional discovery, match reasons, and save controls."
          width={1440}
          height={1000}
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
