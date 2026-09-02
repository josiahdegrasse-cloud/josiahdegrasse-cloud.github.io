export const tokens = {
  colors: {
    paper: "#FAFAFA",
    surface: "#FFFFFF",
    ink: "#09090B",
    graphite: "#3F3F46",
    structure: "#3F3F46",
    heat: "#D9470F",
    blueprint: "#1F4E5F",
    verdigris: "#2C7A6B",
    field: "#5F6F3E",
    copper: "#B25A2B",
  },
  motion: {
    micro: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
    ui: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
    scene: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
    ambient: { duration: 8, ease: "linear" },
  },
} as const;
