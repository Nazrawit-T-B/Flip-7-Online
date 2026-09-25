// Generates seat positions on an ellipse around the table center.
// Coordinates are ratios (0 to 1) of container width/height,
// so they scale to any screen size — just render as percentages.

function getPosition(angleDeg) {
  // 0° = bottom (12 o'clock is top, so we offset by +90 to start at bottom)
  const angle = (angleDeg - 90) * (Math.PI / 180);
  const rx = 0.35; // horizontal radius as ratio of width
  const ry = 0.35; // vertical radius as ratio of height
  return {
    x: 0.5 + rx * Math.cos(angle),
    y: 0.5 + ry * Math.sin(angle),
  };
}

function labelPosition(angleDeg) {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a === 0) return "bottom";
  if (a === 180) return "top";
  if (a > 0 && a < 180) return a < 90 ? "bottom-left" : "top-left";
  return a < 270 ? "top-right" : "bottom-right";
}

function generateLayout(count) {
  const layout = [];
  const startAngle = 0; // Player 1 always at bottom
  const step = 360 / count;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * step;
    const { x, y } = getPosition(angle);
    layout.push({
      name: `Player ${i + 1}`,
      position: labelPosition(angle),
      x, // ratio, e.g. 0.5
      y, // ratio, e.g. 0.08
    });
  }

  return layout;
}

const LAYOUTS = {};
for (let n = 2; n <= 6; n++) {
  LAYOUTS[n] = generateLayout(n);
}

export default LAYOUTS;