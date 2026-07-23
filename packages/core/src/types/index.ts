// Common types for the Farkle game

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type DiceRoll = DiceValue[];

export type PlayerScore = {
  playerId: string;
  score: number;
  turnScore: number;
  isActive: boolean;
};

export type GameState = {
  players: PlayerScore[];
  currentPlayerIndex: number;
  dice: DiceValue[];
  selectedDice: boolean[];
  rollsRemaining: number;
  gameOver: boolean;
  winner: string | null;
};

export type GameAction =
  | { type: "ROLL_DICE" }
  | { type: "SELECT_DICE"; payload: number }
  | { type: "BANK_SCORE" }
  | { type: "END_TURN" }
  | { type: "RESET_GAME" }
  | { type: "SET_PLAYERS"; payload: string[] };

export type ScoreCombination = {
  name: string;
  score: number;
  dice: DiceValue[];
};

export type ScoringResult = {
  totalScore: number;
  combinations: ScoreCombination[];
  remainingDice: DiceValue[];
};
