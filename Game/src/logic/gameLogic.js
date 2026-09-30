export const WIN_SCORE = 200;
const FLIP7_BONUS = 15;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const log = (s, msg) => {
  s.log.push(msg);
  if (s.log.length > 30) s.log.shift();
};

export function buildDeck() {
  const cards = [];
  let id = 0;
  const add = (card, count = 1) => {
    for (let i = 0; i < count; i++) cards.push({ ...card, id: id++ });
  };
  add({ kind: "number", value: 0 });
  for (let v = 1; v <= 12; v++) add({ kind: "number", value: v }, v);
  [2, 4, 6, 8, 10].forEach((v) => add({ kind: "modifier", op: "add", value: v }));
  add({ kind: "modifier", op: "x2" });
  ["freeze", "flip3", "second"].forEach((k) => add({ kind: k }, 3));
  return shuffle(cards); // 94 cards
}

export const cardText = (c) => {
  if (c.kind === "number") return String(c.value);
  if (c.kind === "modifier") return c.op === "x2" ? "×2" : `+${c.value}`;
  return { freeze: "Freeze", flip3: "Flip 3", second: "2nd Chance" }[c.kind];
};

export function scoreHand(p) {
  if (p.status === "busted") return 0;
  const base = p.numbers.reduce((sum, c) => sum + c.value, 0);
  const doubled = p.modifiers.some((m) => m.op === "x2") ? base * 2 : base;
  const adds = p.modifiers
    .filter((m) => m.op === "add")
    .reduce((sum, m) => sum + m.value, 0);
  const bonus = p.numbers.length === 7 ? FLIP7_BONUS : 0;
  return doubled + adds + bonus;
}

/* ---------- helpers (all mutate the draft state `s`) ---------- */

function draw(s) {
  if (!s.deck.length) {
    s.deck = shuffle(s.discard);
    s.discard = [];
    log(s, "Deck reshuffled");
  }
  return s.deck.pop() ?? null;
}

function nextWhere(s, from, pred) {
  const n = s.players.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    if (pred(s.players[i])) return i;
  }
  return null;
}
const nextActive = (s, from) => nextWhere(s, from, (p) => p.status === "active");

// Give `card` to player `pi`. Action cards needing a target go into `sink`.
function receive(s, pi, card, sink) {
  const p = s.players[pi];
  s.lastCard = { player: pi, card };

  switch (card.kind) {
    case "number": {
      if (p.numbers.some((c) => c.value === card.value)) {
        if (p.secondChance) {
          s.discard.push(card, p.secondChance);
          p.secondChance = null;
          log(s, `${p.name} drew a duplicate ${card.value} but Second Chance saved them`);
        } else {
          s.discard.push(card);
          p.status = "busted";
          log(s, `${p.name} drew a duplicate ${card.value} and BUSTED`);
        }
      } else {
        p.numbers.push(card);
        log(s, `${p.name} flipped ${card.value}`);
        if (p.numbers.length === 7) {
          s.flip7 = pi;
          log(s, `${p.name} got FLIP 7!`);
        }
      }
      break;
    }
    case "modifier":
      p.modifiers.push(card);
      log(s, `${p.name} drew ${cardText(card)}`);
      break;
    case "second": {
      if (!p.secondChance) {
        p.secondChance = card;
        log(s, `${p.name} drew Second Chance`);
      } else {
        const t = nextWhere(s, pi, (q) => q.status === "active" && !q.secondChance);
        if (t !== null) {
          s.players[t].secondChance = card;
          log(s, `${p.name} passed Second Chance to ${s.players[t].name}`);
        } else {
          s.discard.push(card);
        }
      }
      break;
    }
    default: // freeze / flip3 -> needs a target
      sink.push({ card, from: pi });
      log(s, `${p.name} drew ${cardText(card)}`);
  }
}

function flipThree(s, ti) {
  const deferred = [];
  for (let i = 0; i < 3; i++) {
    if (s.players[ti].status !== "active" || s.flip7 !== null) break;
    const c = draw(s);
    if (!c) break;
    receive(s, ti, c, deferred);
  }
  // action cards drawn during Flip Three resolve afterwards (unless round is over for them)
  if (s.players[ti].status === "active" && s.flip7 === null) s.queue.push(...deferred);
  else deferred.forEach((d) => s.discard.push(d.card));
}

function endRound(s) {
  s.queue.forEach((a) => s.discard.push(a.card));
  s.queue = [];
  s.players.forEach((p) => {
    p.roundScore = scoreHand(p);
    p.total += p.roundScore;
  });
  const top = Math.max(...s.players.map((p) => p.total));
  const leaders = s.players.filter((p) => p.total === top);
  if (top >= WIN_SCORE && leaders.length === 1) {
    s.winner = s.players.findIndex((p) => p.total === top);
    s.phase = "gameOver";
  } else {
    s.phase = "roundOver"; // a tie at 200+ keeps playing
  }
}

// Moves the game forward until it needs player input.
function advance(s) {
  const n = s.players.length;
  for (;;) {
    if (s.flip7 !== null || s.players.every((p) => p.status !== "active")) {
      return endRound(s);
    }
    if (s.queue.length) {
      s.phase = "target";
      return;
    }
    if (s.dealPos < n) {
      const pi = (s.first + s.dealPos) % n;
      s.dealPos++;
      if (s.players[pi].status === "active") {
        const c = draw(s);
        if (c) receive(s, pi, c, s.queue);
      }
      continue;
    }
    if (s.passTurn) {
      s.current = nextActive(s, s.current);
      s.passTurn = false;
    }
    if (s.players[s.current].status !== "active") {
      s.current = nextActive(s, s.current);
    }
    s.phase = "turn";
    return;
  }
}

function startRound(s) {
  const n = s.players.length;
  s.players.forEach((p) => {
    s.discard.push(...p.numbers, ...p.modifiers);
    if (p.secondChance) s.discard.push(p.secondChance);
    Object.assign(p, {
      numbers: [],
      modifiers: [],
      secondChance: null,
      status: "active",
      roundScore: 0,
    });
  });
  s.first = (s.round - 1) % n;
  s.current = s.first;
  s.dealPos = 0;
  s.flip7 = null;
  s.queue = [];
  s.passTurn = false;
  s.lastCard = null;
  log(s, `Round ${s.round} begins`);
  advance(s);
}



export function createGame(names) {
  const s = {
    players: names.map((name) => ({
      name,
      total: 0,
      numbers: [],
      modifiers: [],
      secondChance: null,
      status: "active",
      roundScore: 0,
    })),
    deck: buildDeck(),
    discard: [],
    round: 1,
    log: [],
    winner: null,
    phase: "turn",
  };
  startRound(s);
  return s;
}

export function reducer(state, action) {
  switch (action.type) {
    case "FLIP": {
      if (state.phase !== "turn") return state;
      const s = structuredClone(state);
      s.passTurn = true;
      const c = draw(s);
      if (c) receive(s, s.current, c, s.queue);
      advance(s);
      return s;
    }
    case "STAY": {
      if (state.phase !== "turn") return state;
      const s = structuredClone(state);
      s.players[s.current].status = "stayed";
      log(s, `${s.players[s.current].name} stayed`);
      s.passTurn = true;
      advance(s);
      return s;
    }
    case "TARGET": {
      if (state.phase !== "target") return state;
      if (state.players[action.index]?.status !== "active") return state;
      const s = structuredClone(state);
      const a = s.queue.shift();
      const target = s.players[action.index];
      s.discard.push(a.card);
      if (a.card.kind === "freeze") {
        target.status = "frozen";
        log(s, `${s.players[a.from].name} froze ${target.name}`);
      } else {
        log(s, `${s.players[a.from].name} made ${target.name} flip three`);
        flipThree(s, action.index);
      }
      advance(s);
      return s;
    }
    case "NEXT_ROUND": {
      if (state.phase !== "roundOver") return state;
      const s = structuredClone(state);
      s.round++;
      startRound(s);
      return s;
    }
    case "RESTART":
      return createGame(state.players.map((p) => p.name));
    default:
      return state;
  }
}