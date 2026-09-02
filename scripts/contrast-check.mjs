const tokens = {
  paper: "#FAFAFA",
  surface: "#FFFFFF",
  ink: "#09090B",
  graphite: "#3F3F46",
  structure: "#3F3F46",
  heat: "#D9470F",
  white: "#FFFFFF",
};

const checks = [
  ["ink", "paper", 4.5, "primary text"],
  ["graphite", "paper", 4.5, "body text"],
["ink", "surface", 4.5, "panel text"],
["graphite", "surface", 4.5, "panel body text"],
["white", "ink", 4.5, "primary CTA text"],
["ink", "paper", 3, "accent/UI state"],
["structure", "surface", 3, "taste-sensing chart/UI accent"],
["heat", "paper", 3, "orange highlighter"],
["heat", "ink", 3, "orange highlighter on dark hover"],
];

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function channel(c) {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const failures = checks.flatMap(([fgName, bgName, threshold, label]) => {
  const ratio = contrast(tokens[fgName], tokens[bgName]);
  const status = ratio >= threshold ? "pass" : "fail";
  console.log(`${status.padEnd(4)} ${fgName} on ${bgName}: ${ratio.toFixed(2)} (${label}, required ${threshold})`);
  return status === "fail" ? [`${fgName} on ${bgName}`] : [];
});

if (failures.length) {
  console.error(`Contrast check failed: ${failures.join(", ")}`);
  process.exit(1);
}
