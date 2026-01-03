/**
 * Calculation Utilities
 * 
 * Functions for performing calculations
 */

// ===== PROGRESS & PERCENTAGE =====

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// ===== PROFIT & MARGIN =====

export function calculateProfit(revenue: number, cost: number): number {
  return revenue - cost;
}

export function calculateProfitMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

export function calculateProfitPercentage(revenue: number, cost: number): number {
  if (cost === 0) return revenue > 0 ? Infinity : 0;
  return ((revenue - cost) / cost) * 100;
}

export function calculateMarkup(cost: number, sellPrice: number): number {
  if (cost === 0) return sellPrice > 0 ? Infinity : 0;
  return ((sellPrice - cost) / cost) * 100;
}

// ===== AVERAGE & STATISTICS =====

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function calculateSum(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

export function calculateMin(numbers: number[]): number | null {
  if (numbers.length === 0) return null;
  return Math.min(...numbers);
}

export function calculateMax(numbers: number[]): number | null {
  if (numbers.length === 0) return null;
  return Math.max(...numbers);
}

// ===== RATE CALCULATIONS =====

export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  // Round to 1 decimal place to avoid floating point precision issues
  return Math.round((completed / total) * 100 * 10) / 10;
}

export function calculateSuccessRate(successful: number, total: number): number {
  return calculateCompletionRate(successful, total);
}

export function calculateErrorRate(errors: number, total: number): number {
  return calculateCompletionRate(errors, total);
}

// ===== FEE CALCULATIONS =====

export function calculateFee(amount: number, feePercent: number): number {
  return amount * (feePercent / 100);
}

export function calculateNetAmount(amount: number, feePercent: number): number {
  return amount - calculateFee(amount, feePercent);
}

export function calculateGrossAmount(netAmount: number, feePercent: number): number {
  return netAmount / (1 - feePercent / 100);
}

// ===== RATING & SCORE =====

export function calculateRating(totalPoints: number, totalRatings: number): number {
  if (totalRatings === 0) return 0;
  return totalPoints / totalRatings;
}

export function calculateWeightedAverage(
  values: number[],
  weights: number[]
): number {
  if (values.length !== weights.length || values.length === 0) return 0;
  
  const totalWeight = calculateSum(weights);
  if (totalWeight === 0) return 0;
  
  const weightedSum = values.reduce((sum, value, i) => sum + value * weights[i], 0);
  return weightedSum / totalWeight;
}

// ===== GROWTH & TREND =====

export function calculateGrowthRate(oldValue: number, newValue: number): number {
  return calculatePercentageChange(oldValue, newValue);
}

export function calculateCompoundGrowthRate(
  initialValue: number,
  finalValue: number,
  periods: number
): number {
  if (initialValue === 0 || periods === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / periods) - 1) * 100;
}

// ===== ROLLING AVERAGE =====

export function calculateRollingAverage(values: number[], windowSize: number): number {
  if (values.length === 0) return 0;
  const window = values.slice(-windowSize);
  return calculateAverage(window);
}

export function calculateMovingAverage(values: number[]): number[] {
  if (values.length < 2) return values;
  
  return values.map((_, index) => {
    if (index === 0) return values[0];
    return calculateAverage(values.slice(0, index + 1));
  });
}

// ===== CALCULATOR OBJECT =====

export const calculator = {
  progress: calculateProgress,
  percentage: calculatePercentage,
  percentageChange: calculatePercentageChange,
  profit: calculateProfit,
  profitMargin: calculateProfitMargin,
  profitPercentage: calculateProfitPercentage,
  markup: calculateMarkup,
  average: calculateAverage,
  median: calculateMedian,
  sum: calculateSum,
  min: calculateMin,
  max: calculateMax,
  completionRate: calculateCompletionRate,
  successRate: calculateSuccessRate,
  errorRate: calculateErrorRate,
  fee: calculateFee,
  netAmount: calculateNetAmount,
  grossAmount: calculateGrossAmount,
  rating: calculateRating,
  weightedAverage: calculateWeightedAverage,
  growthRate: calculateGrowthRate,
  compoundGrowthRate: calculateCompoundGrowthRate,
  rollingAverage: calculateRollingAverage,
  movingAverage: calculateMovingAverage,
} as const;
