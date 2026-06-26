import type { ChapterId } from "./game-types";

/** The résumé thesis — the one verb that ties every room together. */
export const THESIS =
  "I turn messy real-world workflows into tools people can actually use — especially when AI has to be explainable, reviewable, and easy to hand off.";

/** The "long way through": the order the guided first run nudges players along. */
export const recommendedOrder: ChapterId[] = [
  "helfrich",
  "nfi",
  "red-hat",
  "headtap",
  "lacrosse",
  "field",
];

type RoomStory = {
  /** A connective line shown over the transition as you arrive — draws the thread from the last room. */
  arrival: string;
  /** The one-line takeaway, surfaced on completion and carried by the bedroom artifact. */
  lesson: string;
};

export const roomStory: Record<ChapterId, RoomStory> = {
  recovery: {
    arrival: "Back to the room where all of it started.",
    lesson: "",
  },
  helfrich: {
    arrival: "Start on the floor, where precision had consequences.",
    lesson: "Helfrich taught precision — a fixture is a workflow made physical.",
  },
  headtap: {
    arrival: "The same pattern-reading that wins a backgammon game finds the right show in a strange city.",
    lesson: "HeadTap taught taste — software should meet people where their habits already are.",
  },
  nfi: {
    arrival: "Carry the maker's eye into a lab full of evidence.",
    lesson: "New Food Innovation taught judgment — AI is only useful when a human can review and own the call.",
  },
  "red-hat": {
    arrival: "Precision and empathy meet the hardest question: when do people trust a machine?",
    lesson: "Red Hat taught trust — speed means nothing without visibility, grounding, and a way back.",
  },
  lacrosse: {
    arrival: "Every system here was really about people. So is a team.",
    lesson: "Lacrosse taught discipline — one standard, repeated, with people you'd do anything for.",
  },
  field: {
    arrival: "Now put all of it in your hands and take the shot.",
    lesson: "The field is the point: the work only counts when it survives real use.",
  },
  rooftop: {
    arrival: "You climbed out of the bedroom window and somehow the yard has a mountain road. Normal.",
    lesson: "",
  },
};

/** Shown when the player returns to a fully-explored bedroom. */
export const HOMECOMING = "Home, with everything you earned.";

export const ENDING_SYNTHESIS =
  "Engineering taught precision. Product design taught empathy. AI taught the value of a human in the loop. Athletics taught collective discipline. It was never separate work — it is one verb in different rooms: turn the mess into something a person can actually use.";
