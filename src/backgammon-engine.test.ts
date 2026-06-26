import { describe, expect, it } from "vitest";
import {
  applyMove,
  allLegalMoves,
  bestSequence,
  initialBackgammon,
  legalMovesForDie,
  hasWon,
  pipTotal,
  type Backgammon,
} from "./backgammon-engine";

describe("backgammon engine", () => {
  it("starts both sides at 167 pips", () => {
    const game = initialBackgammon();
    expect(pipTotal(game, "white")).toBe(167);
    expect(pipTotal(game, "dark")).toBe(167);
  });

  it("forces entry from the bar", () => {
    const game: Backgammon = { ...initialBackgammon("white"), barWhite: 1, dice: [2] };
    const moves = legalMovesForDie(game, 2);
    expect(moves).toHaveLength(1);
    expect(moves[0].from).toBe("bar");
    expect(moves[0].to).toBe(22); // 24 - 2
  });

  it("hits an opponent blot and sends it to the bar", () => {
    const points = new Array(24).fill(0);
    points[10] = 1; // white checker
    points[8] = -1; // dark blot
    const game: Backgammon = {
      points, barWhite: 0, barDark: 0, offWhite: 0, offDark: 0, turn: "white", dice: [2],
    };
    const move = legalMovesForDie(game, 2).find((m) => m.from === 10 && m.to === 8);
    expect(move?.hit).toBe(true);
    const next = applyMove(game, move!);
    expect(next.points[8]).toBe(1); // white now occupies
    expect(next.barDark).toBe(1); // dark went to the bar
  });

  it("bears off with an exact die and detects a win", () => {
    const points = new Array(24).fill(0);
    points[5] = 1; // last white checker, home
    const game: Backgammon = {
      points, barWhite: 0, barDark: 0, offWhite: 14, offDark: 0, turn: "white", dice: [6],
    };
    const move = legalMovesForDie(game, 6).find((m) => m.to === "off");
    expect(move).toBeTruthy();
    const next = applyMove(game, move!);
    expect(next.offWhite).toBe(15);
    expect(hasWon(next, "white")).toBe(true);
  });

  it("AI returns a legal, dice-consuming sequence", () => {
    const game: Backgammon = { ...initialBackgammon("dark"), dice: [3, 1] };
    const seq = bestSequence(game);
    expect(seq.length).toBeGreaterThan(0);
    // every move in the sequence uses one of the rolled dice
    for (const move of seq) expect([3, 1]).toContain(move.die);
    // the first move is among the legal moves of the position
    const legalFirst = allLegalMoves(game).some((m) => m.from === seq[0].from && m.to === seq[0].to && m.die === seq[0].die);
    expect(legalFirst).toBe(true);
  });
});
