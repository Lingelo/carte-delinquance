const SCALE = [
  '#22c55e', // green-500
  '#4ade80', // green-400
  '#86efac', // green-300
  '#fde047', // yellow-300
  '#facc15', // yellow-400
  '#fb923c', // orange-400
  '#f97316', // orange-500
  '#ef4444', // red-500
  '#dc2626', // red-600
  '#b91c1c', // red-700
];

/**
 * Build quantile thresholds from a sorted array of values.
 * Returns n-1 breakpoints for n color bins.
 */
export function quantileThresholds(values: number[], bins: number = SCALE.length): number[] {
  const sorted = [...values].filter((v) => v > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  const thresholds: number[] = [];
  for (let i = 1; i < bins; i++) {
    const idx = Math.floor((i / bins) * sorted.length);
    thresholds.push(sorted[Math.min(idx, sorted.length - 1)]);
  }
  return thresholds;
}

/**
 * Return a color from the green-to-red scale based on quantile thresholds.
 */
export function getColor(value: number, thresholds: number[]): string {
  if (thresholds.length === 0) return SCALE[0];
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) return SCALE[i];
  }
  return SCALE[SCALE.length - 1];
}

export { SCALE };
