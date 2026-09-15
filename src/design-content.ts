export const profile = {
  name: "Josiah deGrasse",
  title: "AI Engineer · Human Factors",
  email: "Josiah.deGrasse@tufts.edu",
  linkedin: "https://www.linkedin.com/in/josiahdegrasse",
  github: "https://github.com/josiahdegrasse-cloud",
  origin: (
    import.meta.env.VITE_SITE_ORIGIN ||
    "https://josiah-design-portfolio.henrydegrasse.chatgpt.site"
  ).replace(/\/$/, ""),
};
export const redHatProject = {
  prototypeV2: "https://patron-asset-93273794.figma.site/",
  prototypeV3: "https://dress-arc-94202943.figma.site/",
  notebook:
    "https://app.notion.com/p/Spring-2026-Tufts-x-Red-Hat-Senior-Capstone-2fb8dccc334380f89579c04e5669bc1c",
  cover: "/images/red-hat/capstone-diagnostics.png",
};
export const selectedWork = [
  {
    id: "nfi",
    number: "01",
    title: "New Food Innovation",
    subtitle: "From scattered evidence to a clear decision.",
    category: "AI product engineering",
    year: "2026 — ongoing",
    description:
      "Food scientists need to connect sensory tests, research, and consumer feedback before deciding what to develop next. I design the workspace that brings that evidence into a reviewable product decision.",
    image: "/images/nfi/nfi-decision.webp",
    contribution: "Product workflows, evidence presentation, AI review patterns, and retrieval evaluation.",
    status: "Ongoing product work. The application is shown with synthetic data; the retrieval pilot is documented separately.",
    alt: "NFI’s decision review showing a GO recommendation, evidence limits, and a comparison between two demonstration prototypes.",
  },
  {
    id: "red-hat",
    number: "02",
    title: "Red Hat OpenShift AI",
    subtitle: "Less friction. More control.",
    category: "UX research & prototyping",
    contribution: "UX design and prototype iteration alongside two researchers, a project manager, and another designer.",
    status: "Eight discovery interviews and two feedback rounds informed the final prototype. Implementation remained a next step.",
    year: "2026",
    description:
      "When an AI deployment fails, engineers need to understand why and what to change. Our five-person Tufts team designed a workflow that connects failure diagnostics, logs, and reviewable fixes inside OpenShift AI.",
  },
  {
    id: "headtap",
    number: "03",
    title: "HeadTap",
    subtitle: "The next show starts with your taste.",
    category: "Founder / Product design",
    contribution: "Product concept, listener profiles, concert discovery, and the save-and-feedback flow.",
    status: "Working app demonstrated with sample music and events. Recommendation quality still needs testing with real listeners.",
    year: "2025",
    description:
      "Finding a show should start with your music taste, then narrow by the details that make going possible. I created HeadTap to connect listener profiles with concert recommendations, match explanations, and a saved shortlist.",
  },
];
export const secondaryWork = [
  {
    id: "headtap",
    name: "HeadTap",
    category: "Music discovery · 2025",
    summary: "Finding the next show through the music you already love.",
  },
  {
    id: "lacrosse",
    name: "Made for the field",
    category: "Physical design · Lacrosse",
    summary: "Lacrosse equipment, CAD, and physical prototyping.",
  },
  {
    id: "helfrich",
    name: "Helfrich Brothers",
    category: "Manufacturing · 2024",
    summary: "Fixtures for robotic welding and CNC machinery.",
  },
];
