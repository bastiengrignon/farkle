import type { FarkleSettings, Game } from '../types';

export const FARKLE_SCORES = {
  FIFTY: 50,
  HUNDRED: 100,
  THREE_DICE: (diceNumber: number) => (diceNumber === 1 ? 1000 : diceNumber * 100),
  FOUR_DICE: (diceNumber: number) => (diceNumber === 1 ? 1500 : 1000),
  STRAIGHT: 1500,
  THREE_PAIR: 1500,
  FIVE_DICE: 2000,
  SIX_DICE: 3000,
  FOUR_DICE_ONE_PAIR: 1500,
  TWO_TRIPLETS: 2500,
};

export const TRIPLE_ONE_SCORE_OPTIONS = [300, 1000] as const;

export const DEFAULT_FARKLE_SETTINGS: FarkleSettings = {
  consecutiveFarkle: {
    enabled: false,
    scorePenalty: 100,
  },
  sixDiceFarkle: {
    enabled: false,
    score: 100,
  },
  minimumFirstScore: {
    enabled: true,
    score: 500,
  },
  tripleOneScore: 1000,
  revertPlayerScoreOnSameScore: false,
};

export const getOrCreateArray = <T>(array: T | null) => (Array.isArray(array) ? array : []);

export const getNextPlayerId = (game: Game): string | null => {
  if (game.players.length === 0) {
    return game.currenPlayerIdTurn;
  }

  const currentPlayerIndex = game.players.findIndex((player) => player.id === game.currenPlayerIdTurn);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;

  return game.players[nextPlayerIndex].id;
};

export const advanceTurn = (game: Game): Pick<Game, 'currenPlayerIdTurn' | 'isFinished'> => {
  const nextPlayerId = getNextPlayerId(game);
  const isFinished = Boolean(game.finalRoundStartedByPlayerId && nextPlayerId === game.finalRoundStartedByPlayerId);

  return {
    currenPlayerIdTurn: isFinished ? null : nextPlayerId,
    isFinished,
  };
};

export const hasReachedWinningScore = (
  game: Pick<Game, 'scoreToReach' | 'exactScoreRequired'>,
  score: number
): boolean => (game.exactScoreRequired ? score === game.scoreToReach : score >= game.scoreToReach);
