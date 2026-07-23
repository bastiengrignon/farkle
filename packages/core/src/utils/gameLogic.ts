import type { GameState, GameAction, DiceRoll, PlayerScore } from "../types";
import { rollDice, countDice } from "./dice";
import { calculateScore, isScoringRoll } from "./scoring";

const INITIAL_DICE_COUNT = 6;
const MAX_ROLLS_PER_TURN = 3;
const WINNING_SCORE = 10000;

/**
 * Create initial game state
 */
export function createInitialState(playerNames: string[]): GameState {
  const players: PlayerScore[] = playerNames.map((name) => ({
    playerId: name,
    score: 0,
    turnScore: 0,
    isActive: false,
  }));

  // Activate the first player
  if (players.length > 0) {
    players[0].isActive = true;
  }

  return {
    players,
    currentPlayerIndex: 0,
    dice: rollDice(INITIAL_DICE_COUNT),
    selectedDice: Array(INITIAL_DICE_COUNT).fill(false),
    rollsRemaining: MAX_ROLLS_PER_TURN,
    gameOver: false,
    winner: null,
  };
}

/**
 * Game reducer function
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ROLL_DICE": {
      // Check if there are dice to roll
      const unselectedDice = state.dice.filter(
        (_, index) => !state.selectedDice[index]
      );

      if (unselectedDice.length === 0) {
        // All dice are selected, roll all dice
        return {
          ...state,
          dice: rollDice(INITIAL_DICE_COUNT),
          selectedDice: Array(INITIAL_DICE_COUNT).fill(false),
          rollsRemaining: state.rollsRemaining - 1,
        };
      }

      // Roll only unselected dice
      const newDice: DiceRoll = [...state.dice];
      const newSelectedDice = [...state.selectedDice];

      for (let i = 0; i < newDice.length; i++) {
        if (!state.selectedDice[i]) {
          newDice[i] = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
        }
      }

      return {
        ...state,
        dice: newDice,
        selectedDice: newSelectedDice,
        rollsRemaining: state.rollsRemaining - 1,
      };
    }

    case "SELECT_DICE": {
      const newSelectedDice = [...state.selectedDice];
      newSelectedDice[action.payload] = !newSelectedDice[action.payload];

      return {
        ...state,
        selectedDice: newSelectedDice,
      };
    }

    case "BANK_SCORE": {
      // Calculate score from selected dice
      const selectedDiceValues = state.dice.filter(
        (_, index) => state.selectedDice[index]
      );

      if (selectedDiceValues.length === 0) {
        return state; // No dice selected
      }

      const scoreResult = calculateScore(selectedDiceValues);

      if (scoreResult.totalScore === 0) {
        return state; // No scoring combination
      }

      // Update current player's turn score
      const newPlayers = [...state.players];
      const currentPlayer = newPlayers[state.currentPlayerIndex];

      currentPlayer.turnScore += scoreResult.totalScore;

      // Check if player has won
      const totalScore = currentPlayer.score + currentPlayer.turnScore;
      const gameOver = totalScore >= WINNING_SCORE;

      // If all dice are selected or game is over, end turn
      const allDiceSelected = state.selectedDice.every((selected) => selected);

      if (allDiceSelected || gameOver || state.rollsRemaining === 0) {
        return gameReducer(
          {
            ...state,
            players: newPlayers,
          },
          { type: "END_TURN" }
        );
      }

      // Reset selection and dice for next roll
      return {
        ...state,
        players: newPlayers,
        dice: rollDice(INITIAL_DICE_COUNT - selectedDiceValues.length),
        selectedDice: Array(
          INITIAL_DICE_COUNT - selectedDiceValues.length
        ).fill(false),
        rollsRemaining: MAX_ROLLS_PER_TURN,
      };
    }

    case "END_TURN": {
      // Add turn score to total score
      const newPlayers = [...state.players];
      const currentPlayer = newPlayers[state.currentPlayerIndex];

      currentPlayer.score += currentPlayer.turnScore;
      currentPlayer.turnScore = 0;
      currentPlayer.isActive = false;

      // Check if player has won
      const gameOver = currentPlayer.score >= WINNING_SCORE;
      const winner = gameOver ? currentPlayer.playerId : null;

      if (gameOver) {
        return {
          ...state,
          players: newPlayers,
          gameOver: true,
          winner,
        };
      }

      // Move to next player
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % newPlayers.length;
      newPlayers[nextPlayerIndex].isActive = true;

      return {
        ...state,
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        dice: rollDice(INITIAL_DICE_COUNT),
        selectedDice: Array(INITIAL_DICE_COUNT).fill(false),
        rollsRemaining: MAX_ROLLS_PER_TURN,
        gameOver: false,
        winner: null,
      };
    }

    case "RESET_GAME": {
      return createInitialState(
        state.players.map((player) => player.playerId)
      );
    }

    case "SET_PLAYERS": {
      return createInitialState(action.payload);
    }

    default:
      return state;
  }
}

/**
 * Get current player from game state
 */
export function getCurrentPlayer(state: GameState): PlayerScore {
  return state.players[state.currentPlayerIndex];
}

/**
 * Get current player's turn score
 */
export function getCurrentTurnScore(state: GameState): number {
  return getCurrentPlayer(state).turnScore;
}

/**
 * Get current player's total score
 */
export function getCurrentTotalScore(state: GameState): number {
  return getCurrentPlayer(state).score;
}

/**
 * Check if current player can bank (has selected scoring dice)
 */
export function canBankScore(state: GameState): boolean {
  const selectedDiceValues = state.dice.filter(
    (_, index) => state.selectedDice[index]
  );
  return selectedDiceValues.length > 0 && isScoringRoll(selectedDiceValues);
}

/**
 * Check if current player can roll
 */
export function canRoll(state: GameState): boolean {
  return state.rollsRemaining > 0 && !state.gameOver;
}

/**
 * Check if game is over
 */
export function isGameOver(state: GameState): boolean {
  return state.gameOver;
}

/**
 * Get winner
 */
export function getWinner(state: GameState): string | null {
  return state.winner;
}

/**
 * Get all players sorted by score (descending)
 */
export function getPlayersSortedByScore(state: GameState): PlayerScore[] {
  return [...state.players].sort((a, b) => b.score - a.score);
}

/**
 * Check if it's a valid move to select a die
 */
export function canSelectDie(
  state: GameState,
  dieIndex: number
): boolean {
  // Cannot select if game is over
  if (state.gameOver) {
    return false;
  }

  // Cannot select if no rolls remaining and no dice selected
  if (state.rollsRemaining === 0 && state.selectedDice.every((s) => !s)) {
    return false;
  }

  // Check if selecting this die would result in a scoring combination
  const newSelectedDice = [...state.selectedDice];
  newSelectedDice[dieIndex] = !newSelectedDice[dieIndex];

  const selectedDiceValues = state.dice.filter(
    (_, index) => newSelectedDice[index]
  );

  // If we're selecting at least one die, check if it's a scoring combination
  if (selectedDiceValues.length > 0) {
    return isScoringRoll(selectedDiceValues);
  }

  // If we're deselecting, it's always allowed
  return true;
}
