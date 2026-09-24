import { numberCard, plusCard, x2Card, actionCard, ActionKind } from "./card";

export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function buildDeck() {
  const d = [numberCard(0)];
  for (let n = 1; n <= 12; n++)
    for (let i = 0; i < n; i++) d.push(numberCard(n));

  [2, 4, 6, 8, 10].forEach((v) => d.push(plusCard(v)));
  d.push(x2Card());

  Object.values(ActionKind).forEach((kind) => {
    for (let i = 0; i < 3; i++) d.push(actionCard(kind));
  });

  return shuffle(d);
}
