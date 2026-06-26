/**
 * A compact but rules-correct backgammon engine with a heuristic AI.
 *
 * Board: 24 points in `points[]`. Positive counts are White (the human, moving high index -> low,
 * home 0..5). Negative counts are Dark (the AI, moving low -> high, home 18..23). Checkers on the
 * bar and borne off are tracked separately.
 */

export type Player = "white" | "dark";

export type Move = {
  from: number | "bar";
  to: number | "off";
  die: number;
  hit: boolean;
};

export type Backgammon = {
  points: number[];
  barWhite: number;
  barDark: number;
  offWhite: number;
  offDark: number;
  turn: Player;
  dice: number[];
};

const sgn = (player: Player) => (player === "white" ? 1 : -1);
export const opponent = (player: Player): Player => (player === "white" ? "dark" : "white");

export function initialBackgammon(turn: Player = "white"): Backgammon {
  const points = new Array(24).fill(0);
  // White (positive)
  points[23] = 2;
  points[12] = 5;
  points[7] = 3;
  points[5] = 5;
  // Dark (negative)
  points[0] = -2;
  points[11] = -5;
  points[16] = -3;
  points[18] = -5;
  return { points, barWhite: 0, barDark: 0, offWhite: 0, offDark: 0, turn, dice: [] };
}

function clone(state: Backgammon): Backgammon {
  return { ...state, points: [...state.points], dice: [...state.dice] };
}

export function rollDice(): number[] {
  const a = 1 + Math.floor(Math.random() * 6);
  const b = 1 + Math.floor(Math.random() * 6);
  return a === b ? [a, a, a, a] : [a, b];
}

const bar = (state: Backgammon, p: Player) => (p === "white" ? state.barWhite : state.barDark);
const homeStart = (p: Player) => (p === "white" ? 0 : 18);
const homeEnd = (p: Player) => (p === "white" ? 5 : 23);

/** Pips remaining for a checker at `index` to bear off. */
function pipsToOff(index: number, p: Player): number {
  return p === "white" ? index + 1 : 24 - index;
}

export function pipTotal(state: Backgammon, p: Player): number {
  let total = (p === "white" ? state.barWhite : state.barDark) * 25;
  for (let i = 0; i < 24; i += 1) {
    const v = state.points[i];
    if (v === 0) continue;
    if ((v > 0 ? "white" : "dark") === p) total += Math.abs(v) * pipsToOff(i, p);
  }
  return total;
}

function allHome(state: Backgammon, p: Player): boolean {
  if (bar(state, p) > 0) return false;
  for (let i = 0; i < 24; i += 1) {
    const v = state.points[i];
    if (v === 0 || (v > 0 ? "white" : "dark") !== p) continue;
    if (i < homeStart(p) || i > homeEnd(p)) return false;
  }
  return true;
}

function canLand(state: Backgammon, index: number, p: Player): boolean {
  const v = state.points[index];
  if (v === 0) return true;
  if (Math.sign(v) === sgn(p)) return true;
  return Math.abs(v) === 1; // opponent blot — can hit
}

function isBlot(state: Backgammon, index: number, p: Player): boolean {
  const v = state.points[index];
  return v !== 0 && Math.sign(v) !== sgn(p) && Math.abs(v) === 1;
}

function isHighestChecker(state: Backgammon, p: Player, index: number): boolean {
  if (p === "white") {
    for (let i = index + 1; i <= homeEnd(p); i += 1) if (state.points[i] > 0) return false;
  } else {
    for (let i = homeStart(p); i < index; i += 1) if (state.points[i] < 0) return false;
  }
  return true;
}

export function legalMovesForDie(state: Backgammon, die: number): Move[] {
  const p = state.turn;
  const s = sgn(p);
  const moves: Move[] = [];

  if (bar(state, p) > 0) {
    const entry = p === "white" ? 24 - die : die - 1;
    if (canLand(state, entry, p)) moves.push({ from: "bar", to: entry, die, hit: isBlot(state, entry, p) });
    return moves;
  }

  for (let i = 0; i < 24; i += 1) {
    if (state.points[i] === 0 || Math.sign(state.points[i]) !== s) continue;
    const target = p === "white" ? i - die : i + die;
    if (target >= 0 && target <= 23) {
      if (canLand(state, target, p)) moves.push({ from: i, to: target, die, hit: isBlot(state, target, p) });
    } else if (allHome(state, p)) {
      const need = pipsToOff(i, p);
      if (need === die || (die > need && isHighestChecker(state, p, i))) {
        moves.push({ from: i, to: "off", die, hit: false });
      }
    }
  }
  return moves;
}

export function applyMove(state: Backgammon, move: Move): Backgammon {
  const next = clone(state);
  const p = next.turn;
  const s = sgn(p);

  if (move.from === "bar") {
    if (p === "white") next.barWhite -= 1; else next.barDark -= 1;
  } else {
    next.points[move.from] -= s;
  }

  if (move.hit && move.to !== "off") {
    next.points[move.to] = 0;
    if (p === "white") next.barDark += 1; else next.barWhite += 1;
  }

  if (move.to === "off") {
    if (p === "white") next.offWhite += 1; else next.offDark += 1;
  } else {
    next.points[move.to] += s;
  }

  const dieIndex = next.dice.indexOf(move.die);
  if (dieIndex >= 0) next.dice.splice(dieIndex, 1);
  return next;
}

export function allLegalMoves(state: Backgammon): Move[] {
  const seen = new Set<number>();
  const moves: Move[] = [];
  for (const die of state.dice) {
    if (seen.has(die)) continue;
    seen.add(die);
    moves.push(...legalMovesForDie(state, die));
  }
  return moves;
}

export function hasWon(state: Backgammon, p: Player): boolean {
  return (p === "white" ? state.offWhite : state.offDark) === 15;
}

function evaluate(state: Backgammon, ai: Player): number {
  const you = opponent(ai);
  let score = 0;
  score += (ai === "white" ? state.offWhite : state.offDark) * 25;
  score -= (you === "white" ? state.offWhite : state.offDark) * 25;
  score -= (ai === "white" ? state.barWhite : state.barDark) * 12;
  score += (you === "white" ? state.barWhite : state.barDark) * 8;
  score -= pipTotal(state, ai) * 0.6;
  score += pipTotal(state, you) * 0.4;
  for (let i = 0; i < 24; i += 1) {
    const v = state.points[i];
    if (v === 0) continue;
    const owner: Player = v > 0 ? "white" : "dark";
    const count = Math.abs(v);
    if (owner === ai) score += count === 1 ? -3 : 1.5;
    else if (count === 1) score += 2;
  }
  return score;
}

/**
 * Pick the AI's full turn: explores every ordering of the dice and returns the legal sequence of
 * moves that (1) plays the most dice possible, then (2) maximises the positional evaluation.
 */
export function bestSequence(state: Backgammon): Move[] {
  const ai = state.turn;
  let best: { len: number; score: number; seq: Move[] } = { len: -1, score: -Infinity, seq: [] };

  const dfs = (current: Backgammon, seq: Move[]) => {
    const moves = allLegalMoves(current);
    if (moves.length === 0) {
      const score = evaluate(current, ai);
      if (seq.length > best.len || (seq.length === best.len && score > best.score)) {
        best = { len: seq.length, score, seq };
      }
      return;
    }
    for (const move of moves) {
      dfs(applyMove(current, move), [...seq, move]);
    }
  };

  dfs(state, []);
  return best.seq;
}
