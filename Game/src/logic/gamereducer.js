import { isNumber, isModifier, ActionKind } from "./card";

function giveCard(s, idx, card) {
  const p = s.players[idx];
  if (isNumber(card)) {
    if (p.numbers.includes(card.value)) {
      if (p.secondChance) p.secondChance = false;
      else p.status = "busted";
      s.discard.push(card);
    } else {
      p.numbers.push(card.value);
    }
  } else if (isModifier(card)) {
    p.modifiers.push(card);
  } else if (card.kind === ActionKind.SECOND_CHANCE && !p.secondChance) {
    p.secondChance = true;
  } else {
    s.pending = { card, from: idx };
  }
}
