export const CardType = {
  NUMBER: "number",
  MODIFIER: "modifier",
  ACTION: "action",
};
export const ActionKind = {
  FREEZE: "freeze",
  FLIP_THREE: "flipThree",
  SECOND_CHANCE: "secondChance",
};

export const numberCard = (value) => ({ type: CardType.NUMBER, value });
export const plusCard = (value) => ({
  type: CardType.MODIFIER,
  op: "+",
  value,
});
export const x2Card = () => ({ type: CardType.MODIFIER, op: "x2" });
export const actionCard = (kind) => ({ type: CardType.ACTION, kind });

export const isNumber = (c) => c.type === CardType.NUMBER;
export const isModifier = (c) => c.type === CardType.MODIFIER;
export const isAction = (c) => c.type === CardType.ACTION;

export function cardLabel(c) {
  if (isNumber(c)) return String(c.value);
  if (isModifier(c)) return c.op === "x2" ? "×2" : `+${c.value}`;
  return { freeze: "Freeze", flipThree: "Flip 3", secondChance: "2nd Chance" }[
    c.kind
  ];
}
