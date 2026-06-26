import { useCallback, useEffect, useRef, useState } from "react";
import {
  allLegalMoves,
  applyMove,
  bestSequence,
  hasWon,
  initialBackgammon,
  pipTotal,
  rollDice,
  type Backgammon,
  type Move,
} from "./backgammon-engine";

type Selected = number | "bar" | null;

// Pip layout (cells 0-8 of a 3x3 grid) for each die face.
const DIE_PIPS: Record<number, number[]> = {
  1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};

function Die({ value }: { value: number }) {
  return (
    <span className="bg-die">
      {Array.from({ length: 9 }).map((_, i) => (
        <i key={i} className={DIE_PIPS[value]?.includes(i) ? "on" : ""} />
      ))}
    </span>
  );
}

/**
 * Hidden backgammon match against a heuristic AI. You are White (moving 24 -> 1, home lower-right);
 * the AI is Dark. Roll, click a checker, then click a highlighted destination. Esc / Q exits.
 */
export function BackgammonGame({ onExit }: { onExit: () => void }) {
  const [state, setState] = useState<Backgammon>(() => initialBackgammon("white"));
  const [selected, setSelected] = useState<Selected>(null);
  const [message, setMessage] = useState("Your turn — roll the dice.");
  const [aiMove, setAiMove] = useState<Move | null>(null);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Escape" || event.code === "KeyQ") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  const endTurn = useCallback((next: Backgammon, to: "white" | "dark") => {
    setSelected(null);
    setState({ ...next, turn: to, dice: [] });
  }, []);

  // Human: roll when it's your turn and the dice are empty.
  const roll = () => {
    if (state.turn !== "white" || state.dice.length > 0) return;
    const dice = rollDice();
    const rolled = { ...state, dice };
    if (allLegalMoves(rolled).length === 0) {
      setMessage(`You rolled ${dice.join(" · ")} — no legal moves.`);
      window.setTimeout(() => endTurn(rolled, "dark"), 1100);
    } else {
      setMessage(`You rolled ${dice.join(" · ")}.`);
    }
    setState(rolled);
  };

  // AI: when it becomes Dark's turn, roll and play the best sequence after a short "thinking" beat.
  useEffect(() => {
    if (state.turn !== "dark") return;
    if (hasWon(state, "white") || hasWon(state, "dark")) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => {
      const dice = rollDice();
      const rolled = { ...stateRef.current, dice };
      setMessage(`Opponent rolled ${dice.join(" · ")}.`);
      setState(rolled);
      const seq = bestSequence(rolled);
      seq.forEach((move, index) => {
        timers.push(window.setTimeout(() => { setState((cur) => applyMove(cur, move)); setAiMove(move); }, 650 * (index + 1)));
      });
      timers.push(window.setTimeout(() => {
        if (hasWon(stateRef.current, "dark")) setMessage("The AI wins this one. Press Esc and try again.");
        else { setState((cur) => ({ ...cur, turn: "white", dice: [] })); setMessage("Your turn — roll the dice."); setAiMove(null); }
      }, 650 * (seq.length + 1) + 300));
    }, 500));
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.turn]);

  const moves = state.turn === "white" ? allLegalMoves(state) : [];
  const targets = selected === null ? [] : moves.filter((m) => m.from === selected).map((m) => m.to);

  const handle = (target: number | "off" | "bar") => {
    if (state.turn !== "white" || state.dice.length === 0) return;
    if (target === "bar") {
      if (state.barWhite > 0 && moves.some((m) => m.from === "bar")) setSelected("bar");
      return;
    }
    if (selected === null) {
      if (typeof target === "number" && state.points[target] > 0 && moves.some((m) => m.from === target)) setSelected(target);
      return;
    }
    const move = moves.find((m) => m.from === selected && m.to === target);
    if (!move) {
      setSelected(typeof target === "number" && state.points[target] > 0 && moves.some((m) => m.from === target) ? target : null);
      return;
    }
    const next = applyMove(state, move);
    if (hasWon(next, "white")) {
      setState(next);
      setSelected(null);
      setMessage("You win! 🎉 Press Esc to head back.");
      window.dispatchEvent(new CustomEvent("portfolio-keepsake", { detail: "table-crown" }));
      return;
    }
    if (next.dice.length === 0 || allLegalMoves(next).length === 0) endTurn(next, "dark");
    else { setState(next); setSelected(null); }
  };

  const renderPoint = (index: number, where: "top" | "bottom") => {
    const v = state.points[index];
    const count = Math.abs(v);
    const color = v > 0 ? "white" : v < 0 ? "dark" : null;
    const classes = ["bg-point", `bg-${where}`];
    if (selected === index) classes.push("bg-sel");
    if (targets.includes(index)) classes.push("bg-target");
    if (aiMove && (aiMove.from === index || aiMove.to === index)) classes.push("bg-aimove");
    return (
      <button key={index} type="button" className={classes.join(" ")} onClick={() => handle(index)} aria-label={`Point ${index + 1}`}>
        <span className="bg-tri" />
        <span className="bg-pip-no">{index + 1}</span>
        <span className="bg-stack">
          {color && Array.from({ length: Math.min(count, 5) }).map((_, i) => (
            <span key={i} className={`bg-chk bg-${color}`}>{i === Math.min(count, 5) - 1 && count > 5 ? count : ""}</span>
          ))}
        </span>
      </button>
    );
  };

  const topRow = Array.from({ length: 12 }, (_, k) => 12 + k); // 12..23
  const bottomRow = Array.from({ length: 12 }, (_, k) => 11 - k); // 11..0
  const yourTurn = state.turn === "white";
  const won = hasWon(state, "white") ? "white" : hasWon(state, "dark") ? "dark" : null;

  return (
    <div className="pq4-bg" role="dialog" aria-label="Hidden backgammon game">
      <button type="button" className="pq4-snow-exit" onClick={onExit}>Exit ✕</button>

      <div className={`bg-turn ${yourTurn ? "bg-turn-you" : "bg-turn-ai"}`}>
        <span className="bg-chip" />
        {won ? (won === "white" ? "You win!" : "AI wins") : yourTurn ? "Your turn" : "AI is thinking…"}
      </div>

      <div className={`bg-board${yourTurn ? "" : " bg-locked"}`}>
        <div className="bg-row">{topRow.map((i) => renderPoint(i, "top"))}</div>
        <div className="bg-mid">
          <div className="bg-bar">
            <span className="bg-mid-label">BAR</span>
            <button type="button" className={`bg-baritem${selected === "bar" ? " bg-sel" : ""}`} onClick={() => handle("bar")}>
              <span className="bg-chk bg-white" /> {state.barWhite}
            </button>
            <span className="bg-baritem bg-readonly"><span className="bg-chk bg-dark" /> {state.barDark}</span>
          </div>
          <button type="button" className={`bg-off${targets.includes("off") ? " bg-target" : ""}`} onClick={() => handle("off")}>
            <span className="bg-mid-label">BEAR OFF</span>
            <span><span className="bg-chk bg-white" /> {state.offWhite} · <span className="bg-chk bg-dark" /> {state.offDark}</span>
          </button>
        </div>
        <div className="bg-row">{bottomRow.map((i) => renderPoint(i, "bottom"))}</div>
      </div>

      <div className="bg-hud">
        <strong>{message}</strong>
        <div className="bg-dice">
          {state.dice.map((d, i) => <Die key={i} value={d} />)}
          {yourTurn && state.dice.length === 0 && !won && (
            <button type="button" className="bg-roll" onClick={roll}>Roll</button>
          )}
        </div>
        <span className="bg-pips">
          You <b>{state.offWhite}</b>/15 off · {pipTotal(state, "white")} pips &nbsp;|&nbsp; AI <b>{state.offDark}</b>/15 off · {pipTotal(state, "dark")} pips
        </span>
      </div>
    </div>
  );
}
