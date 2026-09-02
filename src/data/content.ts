export type SectionId = "work" | "capabilities" | "about" | "contact";

export const sections: Array<{ id: SectionId; index: string; label: string }> = [
  { id: "work", index: "01", label: "WORK" },
  { id: "capabilities", index: "02", label: "CAPABILITIES" },
  { id: "about", index: "03", label: "ABOUT" },
  { id: "contact", index: "04", label: "CONTACT" },
];

export const hero = {
  eyebrow: "HUMAN FACTORS / PRODUCT DESIGN / ENGINEERING",
  name: "Josiah deGrasse",
  thesis: "I turn complicated work into clear, useful products.",
  support:
    "I study how people actually work, then build software, prototypes, and decision tools around the reality of that work.",
  stats: [
    { value: "Product", label: "React and Supabase tools for sensory research" },
    { value: "Research", label: "Red Hat GenAI onboarding validated through interviews" },
    { value: "Fabrication", label: "Fixtures, CAD models, and field-tested prototypes" },
  ],
};

export const about = {
  headline: "Calm surface. High-output build mode.",
  thesis:
    "I move between user research, software, and physical making without treating them as separate worlds.",
  body: [
    "After tearing my ACL twice, I started sewing during recovery. It made design physical: fit, sequence, material, patience.",
    "Human Factors at Tufts gave that instinct a system. Watch what people actually do, find the constraint, then build around the real behavior.",
    "At New Food Innovation, I am building the sensory platform end to end: React, TypeScript, Supabase, PostgreSQL, study operations, and the guardrails around generation and review.",
    "Lacrosse added the pressure layer. Two national championships and two injuries taught me to keep improving while the plan changes.",
  ],
  principles: [
    {
      label: "CONSTRAINT",
      title: "Recovery.",
      text:
        "Two ACL tears pushed me toward sewing and making. It taught me to care about material, sequence, and fit.",
    },
    {
      label: "HUMAN FACTORS",
      title: "Human factors.",
      text:
        "At Tufts, I learned to build around what people actually do instead of what a system wishes they did.",
    },
    {
      label: "PRODUCT ENGINEERING",
      title: "Product engineering.",
      text:
        "At New Food Innovation, I am building the sensory platform from study setup through deployment.",
    },
    {
      label: "PRESSURE",
      title: "Pressure.",
      text:
        "Two national championships and two injuries taught me how to stay steady when the plan changes.",
    },
  ],
  coordinates: [
    "Human Factors Engineering, Tufts BS May 2026",
    "AI Product Engineer, New Food Innovation",
    "React · TypeScript · Supabase · PostgreSQL",
    "Figma · Python · R · SolidWorks",
  ],
  currently: "CURRENTLY: AI Product Engineer, New Food Innovation, Sheffield UK. On-site Aug 15 through mid-September, 2026.",
  images: {
    portrait: {
      src: "/images/josiah-portrait-dolomites.jpg",
      alt: "Josiah deGrasse standing in the Dolomites, used as the primary portrait for the portfolio.",
    },
    lacrosse: {
      src: "/images/josiah-lacrosse-action.jpg",
      alt: "Josiah deGrasse playing lacrosse in game action.",
    },
  },
};

export type WorkProject = {
  id: string;
  tag?: string;
  title: string;
  subtitle?: string;
  oneLine?: string;
  thesis?: string;
  body: string[];
  metrics?: string[];
  achievements?: string[];
  tags: string[];
};

export const flagship = {
  tag: "FLAGSHIP / CURRENT",
  title: "New Food Innovation | Sensory Platform",
  subtitle: "Sensory Research Platform",
  repository: {
    label: "Sensory Platform repository",
    href: "https://github.com/josiahdegrasse-cloud/Sensory-Platform",
  },
  thesis: "Production platform for food R&D teams that turns sensory studies into decisions.",
  snapshot: [
    {
      label: "Role",
      value: "Product engineer",
      detail: "Solo-building the product surface and implementation path.",
    },
    {
      label: "Stack",
      value: "React / TypeScript / Supabase",
      detail: "PostgreSQL, RLS, Edge Functions, Storage, Auth.",
    },
    {
      label: "Boundary",
      value: "Generated drafts, human review",
      detail: "Deterministic setup where trust matters most.",
    },
  ],
  body: [
    "Before the platform, research lived across spreadsheets, messages, panelist kits, instrumental data, and hand-built reports. I built the product spine: import product data, configure a study, guide at-home panelists, validate concepts, and assemble a commercialization report.",
    "The important design choice was separating speed from trust. Classification stays deterministic; generation is limited to concept visuals and report drafts; approval gates keep panelists and clients from seeing unreviewed AI output.",
  ],
  metrics: ["SOLO-BUILT", "R&D STUDY OPS", "7 SPECIALIZED REVIEW AGENTS"],
  tags: ["React", "TypeScript", "Supabase", "PostgreSQL", "Row Level Security", "Edge Functions", "Multi-Agent AI"],
  caseStudy: [
    {
      title: "Where automation belongs.",
      body:
        "Food-type detection is rule-based because study setup needs to be deterministic and auditable. AI is used for concept visuals and report drafting, where a first draft saves time without replacing judgment.",
    },
    {
      title: "Architecture.",
      body:
        "React (TypeScript) UI, Supabase Auth with Row Level Security, PostgreSQL, Supabase Edge Functions as the boundary to OpenAI for generation, Supabase Storage for assets. Generated database types are kept in sync with the live schema, with drift checks in CI so a migration can't silently break the frontend's assumptions.",
    },
    {
      title: "Testing and deployment.",
      body:
        "Vitest covers unit and integration behavior. ESLint, TypeScript, and production build checks run before deploy so the frontend, schema assumptions, and generated types stay aligned.",
    },
    {
      title: "Outcome.",
      body:
        "No user metrics to report yet, this is a young platform, but the product outcomes are concrete: fewer handoffs, clearer review of generated material, and a better at-home panelist onboarding path through QR-code kits.",
    },
  ],
};

export const professionalSummary = {
  headline: "Product engineer with human factors depth and builder range.",
  body:
    "Range matters when a product crosses research, implementation, and people. I can map the work, choose the right technical boundary, design the interface, and explain the tradeoff.",
  roles: ["Product Engineering", "Human Factors", "UX Research", "Full-stack Build", "Physical Prototyping"],
};

export const capabilities = [
  {
    title: "Build the product",
    description:
      "I can take an ambiguous workflow and turn it into a usable React/TypeScript product with real data, permissions, and operational constraints.",
    evidence: ["NFI sensory platform", "React + TypeScript", "Supabase + PostgreSQL", "RLS and deployment checks"],
  },
  {
    title: "Use automation carefully",
    description:
      "I think carefully about where AI should generate, where deterministic logic should stay in control, and where human review must sit.",
    evidence: ["AI-assisted report generation", "Human approval gates", "Rule-based food classification", "Red Hat GenAI workflow design"],
  },
  {
    title: "Learn from users",
    description:
      "I can run interviews, synthesize patterns, prototype workflows, and explain product opportunities to technical and non-technical stakeholders.",
    evidence: ["8 Red Hat user interviews", "Personas and journey maps", "High-fidelity Figma prototypes", "Stakeholder validation"],
  },
  {
    title: "Bridge screen and shop floor",
    description:
      "Manufacturing and CAD experience gives me a practical sense for constraints, operators, documentation, materials, and failure modes.",
    evidence: ["Helfrich fixtures", "1,000+ modeled components", "SolidWorks", "3D-printed lacrosse head"],
  },
  {
    title: "Make ideas usable",
    description:
      "I build from real observed friction, then create scoring systems, interfaces, and feedback loops that make the problem easier to act on.",
    evidence: ["HeadTap concert matching", "Taste-scoring algorithm", "Spotify OAuth", "Ticketmaster API"],
  },
  {
    title: "Operate under pressure",
    description:
      "Lacrosse, injury recovery, and team leadership shaped how I handle feedback, accountability, repetition, and uncertain plans.",
    evidence: ["Tufts lacrosse", "NCAA DIII championships", "Team culture work", "Youth coaching"],
  },
];

export const projects: WorkProject[] = [
  {
    id: "headtap",
    tag: "CONSUMER · AI MATCHING",
    title: "HeadTap",
    oneLine: "Matches your real listening history to concerts actually worth going to.",
    body: [
      "While I was in Madrid I kept missing shows I would have loved just because I didn't know they were happening. HeadTap connects to Spotify, builds a taste profile from your top artists, songs, and genres, and scores nearby concerts against it instead of just listing whoever's on tour.",
    ],
    metrics: ["1,000+ ARTISTS INDEXED", "SPOTIFY OAUTH", "CUSTOM TASTE-SCORING ALGORITHM"],
    tags: ["React", "Spotify API", "Ticketmaster API"],
  },
  {
    id: "red-hat",
    tag: "ENTERPRISE · GENAI WORKFLOW",
    title: "Red Hat OpenShift AI | GenAI Workflow Design",
    oneLine: "Designed the onboarding and workflow for an enterprise AI deployment tool, validated by Red Hat's own product team.",
    body: [
      "Led end-to-end mixed-methods research for an enterprise AI/ML platform: 8 user interviews, in-person concept testing, and 2 stakeholder feedback sessions, synthesized into personas, journey maps, and 3 validated design opportunities. Built high-fidelity Figma prototypes across two divergent paths, a RAG-based AI assistant and a deterministic diagnostic system, then identified and resolved critical human-AI interaction gaps: contextual onboarding, hybrid hardware configuration, and a YAML diff troubleshooting flow. Validated by Red Hat product leadership against two years of their own internal research.",
    ],
    metrics: ["8 USER INTERVIEWS", "3 VALIDATED DESIGN OPPORTUNITIES", "2 STAKEHOLDER FEEDBACK SESSIONS"],
    tags: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: "helfrich",
    title: "Helfrich Brothers Boiler Works | Engineering Internship",
    oneLine:
      "Designed production fixtures for robotic welders and CNC machinery, and modeled 1,000+ components in SolidWorks supporting a 3x efficiency increase and revenue growth from $4M to $12M.",
    body: [],
    tags: ["SolidWorks", "Manufacturing", "CAD"],
  },
];

export const lacrosseProject = {
  tag: "PERSONAL · CAD / MANUFACTURING",
  title: "Custom Lacrosse Head",
  oneLine: "Designed, printed, and field-tested a lacrosse head in SolidWorks. Then it broke, and that was the useful part.",
  body: [
    "I modeled the Shooter Head v9 in SolidWorks: full orthographic drawings, a scoop geometry designed specifically to protect the mesh and strings from ground-ball wear, then 3D-printed it in nylon on a Prusa. I strung it, brought it to the field, and tested it in real practice conditions.",
    "It cracked. The layer lines from the 3D-printed part turned out to be a real structural weakness, and the material was stiffer and more brittle than it needed to be under high-impact sports loads. That failure taught me more about material selection under real load than the design phase did.",
  ],
  images: [
    {
      src: "/images/lacrosse-head-render.jpg",
      caption: "Shooter Head v9, isometric render.",
      alt: "SolidWorks isometric render of the Shooter Head v9 lacrosse head.",
    },
    {
      src: "/images/lacrosse-head-engineering-drawing.jpg",
      caption:
        "Full orthographic drawing set: isometric, top, front, side, and bottom views, with dimensions and material spec.",
      alt:
        "SolidWorks engineering drawing of the Shooter Head v9 lacrosse head, showing isometric, top, front, side, and bottom views with dimensions.",
    },
    {
      src: "/images/lacrosse-head-3d-printing.jpg",
      caption: "Printed in nylon on a Prusa MK4S.",
      alt: "The Shooter Head v9 lacrosse head being printed in nylon on a Prusa MK4S.",
    },
    {
      src: "/images/lacrosse-head-field-test.jpg",
      caption: "Strung and field-tested in real practice conditions.",
      alt: "The 3D-printed Shooter Head v9 lacrosse head strung and prepared for field testing.",
    },
    {
      src: "/images/lacrosse-head-fracture.jpg",
      caption: "Fracture after impact. Layer-line separation under high-impact load.",
      alt: "Fracture in the 3D-printed Shooter Head v9 lacrosse head after impact, showing layer-line separation.",
    },
  ],
  callouts: [
    "Mesh protection: scoop geometry minimizes contact with ground surfaces",
    "Layer-line weakness: PLA prone to interlayer failure under impact loading",
    "Material brittleness informed the material choice for the next iteration",
  ],
  tags: ["SolidWorks", "CAD", "3D Printing", "Biomechanics"],
};

export const skills = [
  {
    group: "Product & AI",
    items: ["React", "TypeScript", "JavaScript", "LLM prompt engineering", "multi-agent systems", "Python"],
  },
  {
    group: "Data & Infrastructure",
    items: ["Supabase", "PostgreSQL", "SQL", "Row Level Security", "REST APIs", "Git/GitHub", "CI/CD"],
  },
  {
    group: "Design & Fabrication",
    items: ["Figma", "Prototyping", "SolidWorks", "AutoCAD/ZWCAD", "3D Printing", "R"],
  },
];

export const leadership = [
  {
    label: "CHAMPIONSHIP",
    text: "NCAA Division III National Champion, Tufts Men's Lacrosse (2024, 2025)",
  },
  {
    label: "TEAM CULTURE",
    text: "Founded a weekly team newspaper and led a peer mental-health support initiative after two ACL injuries",
  },
  {
    label: "COACHING",
    text: "Youth lacrosse coach, Bronx Lacrosse and Ridgefield, CT",
  },
  {
    label: "SERVICE",
    text: "Fundraises for the HEADstrong Foundation",
  },
];

export const offClock = "Sewing custom-made garments · Backgammon · Baking sourdough · Snowboarding · Surfing";

export const contact = {
  heading: "Let's work together",
  safeBody: "Currently building product systems at New Food Innovation. Graduating from Tufts in May 2026.",
  email: import.meta.env.VITE_CONTACT_EMAIL || "Josiah.deGrasse@tufts.edu",
  linkedin: "https://www.linkedin.com/in/Josiahdegrasse",
  linkedinLabel: "linkedin.com/in/Josiahdegrasse",
  github: "https://github.com/josiahdegrasse-cloud",
  githubLabel: "github.com/josiahdegrasse-cloud",
  formEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || "",
  resumeUrl: import.meta.env.VITE_RESUME_URL || "",
};
