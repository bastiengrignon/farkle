import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { GameState, GameAction, PlayerScore } from "@farkle/core";
import {
  createInitialState,
  gameReducer,
  getCurrentPlayer,
  getCurrentTurnScore,
  getCurrentTotalScore,
  canBankScore,
  canRoll,
  isGameOver,
  getWinner,
  getPlayersSortedByScore,
} from "@farkle/core";

interface GameStore extends GameState {
  // Actions
  rollDice: () => void;
  selectDie: (index: number) => void;
  bankScore: () => void;
  endTurn: () => void;
  resetGame: () => void;
  setPlayers: (playerNames: string[]) => void;
  
  // Selectors
  currentPlayer: () => PlayerScore;
  currentTurnScore: () => number;
  currentTotalScore: () => number;
  canBank: () => boolean;
  canRollDice: () => boolean;
  isGameFinished: () => boolean;
  winner: () => string | null;
  playersSortedByScore: () => PlayerScore[];
}

const initialPlayers = ["Player 1", "Player 2"];

const initialState = createInitialState(initialPlayers);

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Actions
        rollDice: () => {
          const currentState = get();
          const newState = gameReducer(currentState, { type: "ROLL_DICE" });
          set(newState);
        },
        
        selectDie: (index: number) => {
          const currentState = get();
          const newState = gameReducer(currentState, { 
            type: "SELECT_DICE", 
            payload: index 
          });
          set(newState);
        },
        
        bankScore: () => {
          const currentState = get();
          const newState = gameReducer(currentState, { type: "BANK_SCORE" });
          set(newState);
        },
        
        endTurn: () => {
          const currentState = get();
          const newState = gameReducer(currentState, { type: "END_TURN" });
          set(newState);
        },
        
        resetGame: () => {
          const currentState = get();
          const newState = gameReducer(currentState, { type: "RESET_GAME" });
          set(newState);
        },
        
        setPlayers: (playerNames: string[]) => {
          const newState = gameReducer(initialState, { 
            type: "SET_PLAYERS", 
            payload: playerNames 
          });
          set(newState);
        },
        
        // Selectors
        currentPlayer: () => getCurrentPlayer(get()),
        currentTurnScore: () => getCurrentTurnScore(get()),
        currentTotalScore: () => getCurrentTotalScore(get()),
        canBank: () => canBankScore(get()),
        canRollDice: () => canRoll(get()),
        isGameFinished: () => isGameOver(get()),
        winner: () => getWinner(get()),
        playersSortedByScore: () => getPlayersSortedByScore(get()),
      }),
      {
        name: "farkle-game-storage",
        partialize: (state) => ({
          // Only persist these parts of the state
          players: state.players,
          currentPlayerIndex: state.currentPlayerIndex,
          dice: state.dice,
          selectedDice: state.selectedDice,
          rollsRemaining: state.rollsRemaining,
          gameOver: state.gameOver,
          winner: state.winner,
        }),
      }
    ),
    { name: "GameStore" }
  )
);

export default useGameStore;
