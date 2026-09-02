import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
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
      fontFamily: {
        display: ["Archivo", "Arial Black", "Arial", "ui-sans-serif", "system-ui"],
        body: ["IBM Plex Sans", "Helvetica Neue", "Arial", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.55" }],
        xl: ["1.375rem", { lineHeight: "1.35" }],
        "2xl": ["1.75rem", { lineHeight: "1.2" }],
        "3xl": ["2.25rem", { lineHeight: "1.12" }],
        "4xl": ["3rem", { lineHeight: "1.05" }],
        "5xl": ["4rem", { lineHeight: "1" }],
        "6xl": ["5.5rem", { lineHeight: "0.96" }],
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(217, 71, 15, 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
