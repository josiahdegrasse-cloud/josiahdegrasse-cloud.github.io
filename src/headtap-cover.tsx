import "./headtap.css";

export function HeadTapCover() {
  return (
    <div className="headtap-cover">
      <div className="headtap-cover-top">
        <span>HeadTap / Live music discovery</span>
        <span>Independent product</span>
      </div>
      <img
        src="/images/headtap/headtap-concerts.png"
        alt="HeadTap’s original concert discovery interface, showing sample artist matches, venues, dates, and prices."
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
      />
      <span className="headtap-cover-open" aria-hidden="true">
        ↗
      </span>
    </div>
  );
}
