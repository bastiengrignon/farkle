import type { DiceValue, DiceRoll } from "../types";

/**
 * Generate a random dice roll
 */
export function rollDice(count: number = 6): DiceRoll {
  const dice: DiceValue[] = [];
  for (let i = 0; i < count; i++) {
    dice.push((Math.floor(Math.random() * 6) + 1) as DiceValue);
  }
  return dice;
}

/**
 * Count occurrences of each dice value
 */
export function countDice(dice: DiceRoll): Record<DiceValue, number> {
  const counts: Record<DiceValue, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  for (const die of dice) {
    counts[die]++;
  }

  return counts;
}

/**
 * Get all unique dice values from a roll
 */
export function getUniqueDice(dice: DiceRoll): DiceValue[] {
  return [...new Set(dice)] as DiceValue[];
}

/**
 * Check if a dice roll contains a specific value
 */
export function hasDiceValue(dice: DiceRoll, value: DiceValue): boolean {
  return dice.includes(value);
}

/**
 * Filter dice by selected indices
 */
export function filterDiceByIndices(
  dice: DiceRoll,
  selectedIndices: boolean[]
): DiceRoll {
  return dice.filter((_, index) => selectedIndices[index]);
}

/**
 * Get dice values that are not selected
 */
export function getUnselectedDice(
  dice: DiceRoll,
  selectedIndices: boolean[]
): DiceRoll {
  return dice.filter((_, index) => !selectedIndices[index]);
}
