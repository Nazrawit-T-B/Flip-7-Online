import { useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import LAYOUTS from "../../layouts/layouts";
import {
  createGame,
  reducer,
  scoreHand,
  cardText,
  WIN_SCORE,
} from "../logic/gameLogic";

const STATUS = {
  active: null,
  stayed: { label: "Stayed", cls: "bg-slate-500" },
  frozen: { label: "Frozen ❄", cls: "bg-sky-500" },
  busted: { label: "BUST 💥", cls: "bg-red-600" },
};

const Card = ({ card, big = false, className = "" }) => {
  const size = big ? "w-14 h-20 text-2xl" : "w-8 h-11 text-base";
  let color = "bg-white text-slate-900 border-slate-300";
  if (card.kind === "modifier")
    color = "bg-amber-300 text-slate-900 border-amber-500";
  if (card.kind === "second")
    color = "bg-green-300 text-slate-900 border-green-500";
  if (card.kind === "freeze")
    color = "bg-sky-300 text-slate-900 border-sky-500";
  if (card.kind === "flip3")
    color = "bg-fuchsia-300 text-slate-900 border-fuchsia-500";

  const text =
    card.kind === "second"
      ? big
        ? "2nd Chance"
        : "2nd"
      : card.kind === "flip3" && !big
        ? "F3"
        : card.kind === "freeze" && !big
          ? "❄"
          : cardText(card);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-md border font-bold shadow-md ${size} ${color} ${
        big && text.length > 3 ? "text-base text-center leading-tight" : ""
      } ${!big && text.length > 2 ? "text-xs" : ""} ${className}`}
    >
      {text}
    </span>
  );
};

const Btn = ({ className = "", ...props }) => (
  <button
    {...props}
    className={`px-8 py-3 rounded-xl font-bold text-lg transition active:scale-95
      disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
  />
);

const HowToPlay = ({ onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    onClick={onClose}
  >
    <div
      className="bg-slate-800 text-slate-100 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold mb-3">How to play Flip 7</h2>
      <ul className="space-y-2 text-sm list-disc pl-5">
        <li>
          On your turn, <b>FLIP</b> a card or <b>STAY</b> to bank your points.
        </li>
        <li>
          Flip a number you already have and you <b>BUST</b> and score 0 for the
          round.
        </li>
        <li>
          Collect <b>7 different numbers</b> for a Flip 7: the round ends
          instantly and you get +15.
        </li>
        <li>
          <b>Modifiers:</b> +2 to +10 add points, ×2 doubles your number total.
        </li>
        <li>
          <b>Second Chance:</b> cancels one duplicate so you don't bust.
        </li>
        <li>
          <b>Freeze:</b> pick a player; they bank their points and are out for
          the round.
        </li>
        <li>
          <b>Flip 3:</b> pick a player; they must flip three cards in a row.
        </li>
        <li>
          First player to <b>{WIN_SCORE} points</b> wins.
        </li>
      </ul>
      <Btn
        className="mt-5 bg-emerald-500 text-slate-900 w-full"
        onClick={onClose}
      >
        Got it
      </Btn>
    </div>
  </div>
);

const Board = ({ layout }) => {
  const [state, dispatch] = useReducer(reducer, null, () =>
    createGame(layout.map((p) => p.name)),
  );
  const [showRules, setShowRules] = useState(false);

  const { players, phase, current, queue, deck, lastCard, log, winner, round } =
    state;
  const pending = phase === "target" ? queue[0] : null;
  const canAct = phase === "turn";
  const me = players[current];
  const over = phase === "roundOver" || phase === "gameOver";
  let risk = 0;
  if (canAct && !me.secondChance && deck.length) {
    const dup = deck.filter(
      (c) => c.kind === "number" && me.numbers.some((n) => n.value === c.value),
    ).length;
    risk = Math.round((dup / deck.length) * 100);
  }
  const riskColor =
    risk < 20
      ? "text-emerald-400"
      : risk < 40
        ? "text-amber-400"
        : "text-red-400";

  let banner = "";
  if (pending) {
    banner = `${players[pending.from].name}: tap a highlighted player to ${
      pending.card.kind === "freeze" ? "FREEZE them " : "make them FLIP 3 "
    }`;
  } else if (canAct) {
    banner = `${me.name}'s turn: FLIP or STAY`;
  } else if (over) {
    banner = phase === "gameOver" ? "Game over!" : "Round complete";
  }

  return (
    <div className="h-dvh  text-black flex flex-col items-center gap-3 p-3 overflow-hidden">
      <div className="w-full max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-extrabold tracking-tight">Flip 7</h1>
          <p className="text-xs text-slate-400">
            Round {round} · First to {WIN_SCORE}
          </p>
        </div>
        <div
          className={`flex-1 text-center rounded-lg py-1.5 px-3 text-sm font-semibold ${
            pending ? "bg-red-500/20 text-red-200" : "bg-[#ca94a4]"
          }`}
        >
          {banner}
        </div>
        <button
          onClick={() => setShowRules(true)}
          className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-semibold transition"
        >
          How To Play
        </button>
      </div>
      <div
        className="game-board relative w-full max-w-7xl flex-1 min-h-0 rounded-[2rem]
          bg-gradient-to-b from-emerald-700 to-emerald-900 border-4 border-emerald-950 shadow-2xl"
      >
        <div
          className="deck absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          style={{ left: "50%", top: "50%" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-20">
              <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-lg bg-indigo-950 border border-indigo-400/40" />
              <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-lg bg-indigo-900 border border-indigo-400/40" />
              <div className="absolute inset-0 rounded-lg bg-indigo-700 border-2 border-indigo-300 flex items-center justify-center font-bold">
                {deck.length}
              </div>
            </div>
            {lastCard && (
              <div className="flex flex-col items-center">
                <Card card={lastCard.card} big />
                <span className="text-[10px] mt-1 text-emerald-100">
                  {players[lastCard.player].name}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-emerald-100/80 text-center max-w-52 min-h-8">
            {log[log.length - 1]}
          </p>
        </div>

        {/* seats */}
        {layout.map((seat, index) => {
          const p = players[index];
          const isCurrent = !over && index === current;
          const targetable = phase === "target" && p.status === "active";
          const badge = STATUS[p.status];
          const hand = [
            ...p.numbers,
            ...p.modifiers,
            ...(p.secondChance ? [p.secondChance] : []),
          ];

          let tone = "bg-slate-900/80 border-slate-600";
          if (p.status === "busted")
            tone = "bg-red-950/80 border-red-700 opacity-75";
          if (p.status === "frozen")
            tone = "bg-sky-950/80 border-sky-600 opacity-85";
          if (p.status === "stayed")
            tone = "bg-slate-800/80 border-slate-500 opacity-85";

          return (
            <div
              key={index}
              onClick={() => targetable && dispatch({ type: "TARGET", index })}
              className={`player player-${index + 1}  text-white absolute -translate-x-1/2 -translate-y-1/2
                w-40 sm:w-60 rounded-xl border p-2 text-center backdrop-blur-sm transition
                ${tone}
                ${isCurrent ? "ring-4 ring-yellow-400 z-10" : ""}
                ${targetable ? "ring-4 ring-red-500 animate-pulse cursor-pointer hover:scale-105 z-10" : ""}`}
              style={{ left: `${seat.x * 100}%`, top: `${seat.y * 100}%` }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-sm truncate">{p.name}</span>
                <span className="flex items-center gap-1">
                  {badge && (
                    <span
                      className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  )}
                  <span className="text-xs font-bold bg-black/40 rounded px-1.5 py-0.5">
                    {p.total}
                  </span>
                </span>
              </div>

              {/* one horizontal, overlapping row of cards */}
              <div className="flex flex-nowrap justify-center items-center h-12 mt-1.5">
                {hand.length === 0 && (
                  <span className="text-[11px] text-slate-500">
                    no cards yet
                  </span>
                )}
                {hand.map((c) => (
                  <Card
                    key={c.id}
                    card={c}
                    className="-ml-3 first:ml-0 hover:-translate-y-1 hover:z-20 transition-transform"
                  />
                ))}
              </div>

              <p className="text-[11px] text-slate-300 mt-1">
                {p.numbers.length}/7 · round{" "}
                {p.status === "busted" ? 0 : scoreHand(p)}
              </p>
            </div>
          );
        })}
      </div>

      {/* action bar: always visible under the table */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <div className="flex gap-3">
          <Btn
            disabled={!canAct}
            onClick={() => dispatch({ type: "FLIP" })}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900"
          >
            FLIP
          </Btn>
          <Btn
            disabled={!canAct}
            onClick={() => dispatch({ type: "STAY" })}
            className="bg-amber-400 hover:bg-amber-300 text-slate-900"
          >
            STAY
          </Btn>
        </div>
        <p className="text-sm text-slate-300 min-w-64 text-center">
          {canAct ? (
            <>
              Bust risk:{" "}
              <span className={`font-bold ${riskColor}`}>
                {me.secondChance ? "0% (Second Chance)" : `${risk}%`}
              </span>{" "}
              · Banked if you stay: <b>{scoreHand(me)}</b>
            </>
          ) : (
            "\u00A0"
          )}
        </p>
      </div>
      {over && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 text-white ">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-1">
              {phase === "gameOver"
                ? `🏆 ${players[winner].name} wins!`
                : `Round ${round} over`}
            </h2>
            <p className="text-xs text-slate-400 mb-4 min-h-4">
              {state.flip7 !== null &&
                `${players[state.flip7].name} hit Flip 7!`}
            </p>
            <ul className="space-y-1 mb-5">
              {players
                .map((p, i) => ({ ...p, i }))
                .sort((a, b) => b.total - a.total)
                .map((p) => (
                  <li
                    key={p.i}
                    className="flex justify-between items-center bg-slate-700/60 rounded-lg px-3 py-2"
                  >
                    <span className="font-semibold">{p.name}</span>
                    <span>
                      <span
                        className={
                          p.roundScore ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        +{p.roundScore}
                      </span>{" "}
                      <b>{p.total}</b>
                    </span>
                  </li>
                ))}
            </ul>
            <Btn
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 w-full"
              onClick={() =>
                dispatch({
                  type: phase === "gameOver" ? "RESTART" : "NEXT_ROUND",
                })
              }
            >
              {phase === "gameOver" ? "Play Again" : "Next Round"}
            </Btn>
          </div>
        </div>
      )}

      {showRules && <HowToPlay onClose={() => setShowRules(false)} />}
    </div>
  );
};

const Game = () => {
  const location = useLocation();
  const players = location.state?.players ?? 2;
  const layout = LAYOUTS[players];

  if (!layout) return <p>Invalid player count: {players}</p>;

  return <Board key={players} layout={layout} />;
};

export default Game;
