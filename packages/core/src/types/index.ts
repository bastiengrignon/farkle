import type { TRIPLE_ONE_SCORE_OPTIONS } from '../utils';

export type StoredPlayer = {
  name: string;
};

export type GamePlayer = {
  id: string;
  name: string;
  score: number;
  previewScore: number;
  hasScored: boolean;
  consecutiveFarkles: number;
};

export type TurnResult = {
  playerId: string;
  playerName: string;
  scoreBanked: number | null;
  isFarkle: boolean;
  timestamp: number;
  consecutiveFarklePenalty?: number;
  isSixDiceFarkle?: boolean;
};

export type Game = {
  id: string;
  players: GamePlayer[];
  scoreToReach: number;
  exactScoreRequired: boolean;
  currenPlayerIdTurn: string | null;
  finalRoundStartedByPlayerId?: string | null;
  isFinished?: boolean;
};

export type FinishedGame = {
  id: string;
  players: GamePlayer[];
  scoreToReach: number;
  exactScoreRequired: boolean;
  winnerNames: string[];
  timestamp: number;
  turnHistory: TurnResult[];
};

export type FarkleSettings = {
  consecutiveFarkle: {
    enabled: boolean;
    scorePenalty: number;
  };
  sixDiceFarkle: {
    enabled: boolean;
    score: number;
  };
  minimumFirstScore: {
    enabled: boolean;
    score: number;
  };
  tripleOneScore: TripleOneScore;
  revertPlayerScoreOnSameScore: boolean;
};

export type TripleOneScore = (typeof TRIPLE_ONE_SCORE_OPTIONS)[number];

export interface FarkleState {
  players: StoredPlayer[];
  game: Game | null;
  settings: FarkleSettings;
  turnHistory: TurnResult[];
  updateSettings: (settings: FarkleSettings) => void;
  startNewGame: (game: Omit<Game, 'currenPlayerIdTurn'>) => void;
  resetGame: () => void;
  addPointsToPlayer: (score: number) => void;
  undoLastAction: () => void;
  clearPreviewScore: () => void;
  farkle: () => void;
  sixDiceFarkle: () => void;
  bank: () => void;
  nextPlayer: () => void;
  removeStoredPlayer: (playerName: string) => void;
  finishGame: (winners: string[]) => void;
  history: Game[];
  finishedGames: FinishedGame[];
}

export type PodiumWinner = { name: string; wins: number };
