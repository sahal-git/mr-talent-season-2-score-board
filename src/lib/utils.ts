export function formatScore(score: number): string {
  // Check if the score is a whole number
  if (Number.isInteger(score)) {
    return score.toString();
  }
  // If it has decimals, show with appropriate precision
  return score.toFixed(1);
}