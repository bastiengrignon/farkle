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
