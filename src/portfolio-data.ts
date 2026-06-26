export type PortfolioProject = {
  id: string;
  chapter: string;
  room: string;
  title: string;
  subtitle: string;
  logline: string;
  role: string;
  year: string;
  color: "red" | "blue" | "green" | "ochre" | "cream";
  skills: string[];
  evidence: string[];
  story: {
    heading: string;
    body: string;
  }[];
  outcome: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "headtap",
    chapter: "Chapter One",
    room: "The Listening Room",
    title: "HeadTap",
    subtitle: "Concert discovery platform",
    logline:
      "A music discovery system that turns listening history into nearby shows worth leaving the house for.",
    role: "Founder, product designer, developer",
    year: "2025",
    color: "red",
    skills: ["Product strategy", "UX design", "API integration", "Python", "JavaScript"],
    evidence: ["1,000+ artists indexed", "4 APIs connected", "Custom vibe-scoring model"],
    story: [
      {
        heading: "The gap",
        body:
          "While living in Madrid, I saw how difficult it was to discover live music beyond artists people already followed. Venue calendars were fragmented, recommendation feeds ignored location, and good shows disappeared into noise.",
      },
      {
        heading: "The system",
        body:
          "I designed a flow that combines listening taste, artist similarity, venue data, distance, and date. A custom scoring model ranks concerts by fit instead of popularity alone, then explains why each recommendation belongs.",
      },
      {
        heading: "The lesson",
        body:
          "The hard part was not collecting more music data. It was deciding which signals deserved attention and translating an algorithm into choices that still felt personal.",
      },
    ],
    outcome: "A working full-stack platform for personalized, location-aware concert discovery.",
  },
  {
    id: "nfi",
    chapter: "Chapter Two",
    room: "The Food Laboratory",
    title: "New Food Innovation",
    subtitle: "Evidence-to-commercialization platform",
    logline:
      "A connected workspace that helps food R&D teams move from machine measurements and sensory panels to a defensible commercialization decision.",
    role: "AI Product Engineer",
    year: "Jan 2026–present",
    color: "blue",
    skills: ["Human factors", "Product architecture", "React", "Supabase", "Data visualization"],
    evidence: [
      "Built core workflow from scratch",
      "GO / TWEAK / STOP decision engine",
      "79-test automated suite",
    ],
    story: [
      {
        heading: "The fractured workflow",
        body:
          "Food teams were moving among machine exports, spreadsheets, panel questionnaires, charts, concept tests, and report documents. Each tool could answer one question, but the project never felt like one connected decision.",
      },
      {
        heading: "The product journey",
        body:
          "I built the platform around a single evidence chain: import E-Tongue, GC-MS/GC-O, and chemical data; map CSVs with AI assistance; assign panelists; configure surveys; compare human and instrumental signals; then issue a transparent GO, TWEAK, or STOP recommendation.",
      },
      {
        heading: "Human control",
        body:
          "AI drafts questions, detects patterns, and proposes report language, but admins review important outputs before release. Every claim carries provenance, sample size, and evidence strength so automation never masquerades as certainty.",
      },
      {
        heading: "The final payoff",
        body:
          "A promising product can move into concept testing and finish as a branded commercialization report. The report preserves the scientific caveats while giving a client a clear recommendation, risks, and next action.",
      },
    ],
    outcome:
      "A deployed React, TypeScript, and Supabase product that turns disconnected research activities into one traceable lab-to-market journey.",
  },
  {
    id: "red-hat",
    chapter: "Chapter Three",
    room: "The Control Room",
    title: "Red Hat",
    subtitle: "Enterprise AI troubleshooting",
    logline:
      "A one-click workflow concept designed to remove setup friction for AI engineers without hiding critical decisions.",
    role: "Product Designer, senior capstone",
    year: "Jan–May 2026",
    color: "green",
    skills: ["User research", "Personas", "Journey mapping", "Figma", "Prototyping"],
    evidence: ["RAG vs. rule-based testing", "Real OpenShift workflows", "Trust-centered redesign"],
    story: [
      {
        heading: "The contradiction",
        body:
          "Engineers wanted faster setup, but an oversimplified interface could obscure configuration choices that determined model behavior. The design needed to feel immediate without becoming a black box.",
      },
      {
        heading: "Research before screens",
        body:
          "User interviews and stakeholder sessions exposed where people lost trust. I built Figma prototypes around onboarding, hardware setup, YAML diffs, troubleshooting, and deployment handoffs.",
      },
      {
        heading: "Progressive control",
        body:
          "Testing a RAG-based assistant against a rule-based version clarified when users welcomed AI help and when they wanted direct control. The redesign emphasized source grounding, visibility, rollback, and human review.",
      },
    ],
    outcome: "A tested workflow direction that made complex AI deployment faster without disguising its mechanics.",
  },
  {
    id: "lacrosse",
    chapter: "Chapter Four",
    room: "The Equipment Shop",
    title: "Lacrosse & Leadership",
    subtitle: "Championship performance and community",
    logline:
      "Three national championships, a weekly team newspaper, peer-support work, and community coaching built around showing up for other people.",
    role: "NCAA student-athlete and volunteer coach",
    year: "2019–present",
    color: "cream",
    skills: ["Leadership", "Coaching", "Team communication", "Mentorship", "Fundraising"],
    evidence: ["3× NCAA champion", "30+ hours/week", "Team newspaper founder"],
    story: [
      {
        heading: "Designed from use",
        body:
          "I contributed to three consecutive NCAA Division III national championships while balancing more than 30 hours each week of training, games, travel, and academics.",
      },
      {
        heading: "Build the team around the team",
        body:
          "I founded a weekly team newspaper and helped create peer-support pathways that made it easier for teammates to communicate, ask for help, and stay connected.",
      },
      {
        heading: "Widen the field",
        body:
          "I coach youth athletes in Ridgefield and with Bronx Lacrosse, mentor players across backgrounds, and fundraise for HEADstrong to support families affected by pediatric cancer.",
      },
    ],
    outcome: "A leadership practice grounded in discipline, communication, mentorship, and collective performance.",
  },
  {
    id: "helfrich",
    chapter: "Chapter Five",
    room: "The Boiler Room",
    title: "Helfrich Brothers",
    subtitle: "Industrial engineering systems",
    logline:
      "Technical documentation and system design work where precision mattered because the drawings had to survive contact with a factory floor.",
    role: "Mechanical Engineer",
    year: "Jun–Aug 2024",
    color: "ochre",
    skills: ["Technical drawings", "Systems thinking", "CAD", "Documentation", "Manufacturing"],
    evidence: ["3 heads / 3 hr → 8 / 45 min", "1,000+ SolidWorks parts", "Digital twins + fixtures"],
    story: [
      {
        heading: "No decorative decisions",
        body:
          "Industrial boiler work made the consequences of ambiguity obvious. A drawing, specification, or process note had to communicate correctly to people with different responsibilities and little time for interpretation.",
      },
      {
        heading: "Design as coordination",
        body:
          "I designed production fixtures for robotic welders and CNC machinery, increasing boiler-head throughput from three heads per three-hour run to eight heads per 45 minutes.",
      },
      {
        heading: "What stayed with me",
        body:
          "I modeled more than 1,000 SolidWorks components and digital twins to support shop-floor decisions, documentation, BOM accuracy, and rework reduction.",
      },
    ],
    outcome: "Production engineering that made fabrication faster while improving the information people used on the shop floor.",
  },
];

export const portfolioSkills = [
  "Human factors",
  "UX research",
  "Product strategy",
  "Interaction design",
  "React",
  "Python",
  "R",
  "Supabase",
  "SolidWorks",
  "Data visualization",
];
