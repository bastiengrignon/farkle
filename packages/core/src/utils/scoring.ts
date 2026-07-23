import type { DiceRoll, ScoreCombination, ScoringResult } from "../types";
import { countDice } from "./dice";

// Scoring rules for Farkle
const SCORING_RULES: Record<string, (dice: DiceRoll) => number | null> = {
  // Single dice
  ones: (dice: DiceRoll) => {
    const ones = dice.filter((d) => d === 1).length;
    return ones * 100;
  },
  fives: (dice: DiceRoll) => {
    const fives = dice.filter((d) => d === 5).length;
    return fives * 50;
  },
  // Three of a kind
  threeOnes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[1] >= 3 ? 1000 : null;
  },
  threeTwos: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[2] >= 3 ? 200 : null;
  },
  threeThrees: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[3] >= 3 ? 300 : null;
  },
  threeFours: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[4] >= 3 ? 400 : null;
  },
  threeFives: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[5] >= 3 ? 500 : null;
  },
  threeSixes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[6] >= 3 ? 600 : null;
  },
  // Four of a kind
  fourOnes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[1] >= 4 ? 2000 : null;
  },
  fourTwos: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[2] >= 4 ? 400 : null;
  },
  fourThrees: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[3] >= 4 ? 600 : null;
  },
  fourFours: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[4] >= 4 ? 800 : null;
  },
  fourFives: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[5] >= 4 ? 1000 : null;
  },
  fourSixes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[6] >= 4 ? 1200 : null;
  },
  // Five of a kind
  fiveOnes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[1] >= 5 ? 3000 : null;
  },
  fiveTwos: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[2] >= 5 ? 600 : null;
  },
  fiveThrees: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[3] >= 5 ? 900 : null;
  },
  fiveFours: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[4] >= 5 ? 1200 : null;
  },
  fiveFives: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[5] >= 5 ? 1500 : null;
  },
  fiveSixes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[6] >= 5 ? 1800 : null;
  },
  // Six of a kind
  sixOnes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[1] >= 6 ? 4000 : null;
  },
  sixTwos: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[2] >= 6 ? 800 : null;
  },
  sixThrees: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[3] >= 6 ? 1200 : null;
  },
  sixFours: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[4] >= 6 ? 1600 : null;
  },
  sixFives: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[5] >= 6 ? 2000 : null;
  },
  sixSixes: (dice: DiceRoll) => {
    const counts = countDice(dice);
    return counts[6] >= 6 ? 2400 : null;
  },
  // Straight
  smallStraight: (dice: DiceRoll) => {
    const uniqueSorted = [...new Set(dice)].sort((a, b) => a - b);
    const isSmallStraight =
      uniqueSorted.includes(1) &&
      uniqueSorted.includes(2) &&
      uniqueSorted.includes(3) &&
      uniqueSorted.includes(4) &&
      uniqueSorted.includes(5);
    return isSmallStraight ? 1500 : null;
  },
  largeStraight: (dice: DiceRoll) => {
    const uniqueSorted = [...new Set(dice)].sort((a, b) => a - b);
    const isLargeStraight =
      uniqueSorted.includes(2) &&
      uniqueSorted.includes(3) &&
      uniqueSorted.includes(4) &&
      uniqueSorted.includes(5) &&
      uniqueSorted.includes(6);
    return isLargeStraight ? 2000 : null;
  },
  // Full house
  fullHouse: (dice: DiceRoll) => {
    const counts = countDice(dice);
    const values = Object.values(counts);
    const hasThree = values.some((count) => count >= 3);
    const hasTwo = values.some((count) => count >= 2);
    return hasThree && hasTwo ? 1500 : null;
  },
  // Four of a kind + a pair (not standard Farkle, but common variant)
  fourOfAKindPlusPair: (dice: DiceRoll) => {
    const counts = countDice(dice);
    const values = Object.values(counts);
    const hasFour = values.some((count) => count >= 4);
    const hasTwo = values.some((count) => count >= 2);
    return hasFour && hasTwo ? 1500 : null;
  },
  // Two triplets (not standard Farkle, but common variant)
  twoTriplets: (dice: DiceRoll) => {
    const counts = countDice(dice);
    const values = Object.values(counts);
    const triplets = values.filter((count) => count >= 3);
    return triplets.length >= 2 ? 2500 : null;
  },
};

/**
 * Calculate the score for a dice roll
 */
export function calculateScore(dice: DiceRoll): ScoringResult {
  const combinations: ScoreCombination[] = [];
  let totalScore = 0;
  let remainingDice: DiceRoll = [...dice];

  // Check for special combinations first (higher priority)
  const specialCombinations = [
    "sixOnes",
    "sixTwos",
    "sixThrees",
    "sixFours",
    "sixFives",
    "sixSixes",
    "largeStraight",
    "smallStraight",
    "fullHouse",
    "twoTriplets",
    "fourOfAKindPlusPair",
  ];

  for (const comboName of specialCombinations) {
    const score = SCORING_RULES[comboName](dice);
    if (score !== null) {
      combinations.push({
        name: comboName,
        score,
        dice: [...dice],
      });
      totalScore += score;
      remainingDice = [];
      break;
    }
  }

  // If no special combination found, calculate individual dice
  if (remainingDice.length > 0) {
    // Check for three of a kind and higher
    const threeOfAKindCombos = [
      "fiveOnes",
      "fiveTwos",
      "fiveThrees",
      "fiveFours",
      "fiveFives",
      "fiveSixes",
      "fourOnes",
      "fourTwos",
      "fourThrees",
      "fourFours",
      "fourFives",
      "fourSixes",
      "threeOnes",
      "threeTwos",
      "threeThrees",
      "threeFours",
      "threeFives",
      "threeSixes",
    ];

    for (const comboName of threeOfAKindCombos) {
      const score = SCORING_RULES[comboName](remainingDice);
      if (score !== null) {
        const counts = countDice(remainingDice);
        const value = parseInt(comboName.replace(/[^0-9]/g, "")) as 1 | 2 | 3 | 4 | 5 | 6;
        const diceUsed: DiceRoll = [];
        for (let i = 0; i < (comboName.startsWith("five") ? 5 : comboName.startsWith("four") ? 4 : 3); i++) {
          diceUsed.push(value);
        }
        combinations.push({
          name: comboName,
          score,
          dice: diceUsed,
        });
        totalScore += score;
        // Remove the used dice
        remainingDice = remainingDice.filter((d) => {
          if (d === value) {
            counts[value]--;
            return counts[value] > 0;
          }
          return true;
        });
      }
    }

    // Calculate ones and fives from remaining dice
    const onesScore = SCORING_RULES.ones(remainingDice);
    const fivesScore = SCORING_RULES.fives(remainingDice);

    if (onesScore && onesScore > 0) {
      const onesCount = remainingDice.filter((d) => d === 1).length;
      const onesDice: DiceRoll = Array(onesCount).fill(1);
      combinations.push({
        name: "ones",
        score: onesScore,
        dice: onesDice,
      });
      totalScore += onesScore;
    }

    if (fivesScore && fivesScore > 0) {
      const fivesCount = remainingDice.filter((d) => d === 5).length;
      const fivesDice: DiceRoll = Array(fivesCount).fill(5);
      combinations.push({
        name: "fives",
        score: fivesScore,
        dice: fivesDice,
      });
      totalScore += fivesScore;
    }

    // Update remaining dice (remove scored ones and fives)
    remainingDice = remainingDice.filter((d) => d !== 1 && d !== 5);
  }

  return {
    totalScore,
    combinations,
    remainingDice,
  };
}

/**
 * Check if a dice roll scores any points
 */
export function isScoringRoll(dice: DiceRoll): boolean {
  const result = calculateScore(dice);
  return result.totalScore > 0;
}

/**
 * Get all possible scoring combinations for a dice roll
 */
export function getAllScoringCombinations(dice: DiceRoll): ScoreCombination[] {
  const combinations: ScoreCombination[] = [];

  for (const [name, rule] of Object.entries(SCORING_RULES)) {
    const score = rule(dice);
    if (score !== null && score > 0) {
      combinations.push({
        name,
        score,
        dice: [...dice],
      });
    }
  }

  return combinations;
}
