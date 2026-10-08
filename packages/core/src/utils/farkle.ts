import type { FarkleSettings, FarkleState, Game, TurnResult } from '../types';

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
    return game.currentPlayerIdTurn;
  }

  const currentPlayerIndex = game.players.findIndex((player) => player.id === game.currentPlayerIdTurn);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;

  return game.players[nextPlayerIndex].id;
};

export const advanceTurn = (game: Game): Pick<Game, 'currentPlayerIdTurn' | 'isFinished'> => {
  const nextPlayerId = getNextPlayerId(game);
  const isFinished = Boolean(game.finalRoundStartedByPlayerId && nextPlayerId === game.finalRoundStartedByPlayerId);

  return {
    currentPlayerIdTurn: isFinished ? null : nextPlayerId,
    isFinished,
  };
};

export const hasReachedWinningScore = (
  game: Pick<Game, 'scoreToReach' | 'exactScoreRequired'>,
  score: number
): boolean => (game.exactScoreRequired ? score === game.scoreToReach : score >= game.scoreToReach);

export const canBankScore = (game: Game | null, settings: FarkleSettings, score: number): boolean => {
  const player = game?.players.find((player) => player.id === game.currentPlayerIdTurn);
  return Boolean(
    game &&
      !game.isFinished &&
      player &&
      score > 0 &&
      (!settings.minimumFirstScore.enabled || player.hasScored || score >= settings.minimumFirstScore.score) &&
      (!game.exactScoreRequired || player.score + score <= game.scoreToReach)
  );
};

export type BankScoreState = Pick<FarkleState, 'game' | 'settings' | 'history' | 'turnHistory'>;

export type BankScoreNotifications = {
  show: (notification: {
    title: string;
    message: string;
    position: 'top-center';
    color: 'red' | 'orange';
    autoClose?: number;
  }) => unknown;
};

export type BankScoreTranslate = (key: string, options?: { minimum: number }) => string;

export const bankScore = (
  state: BankScoreState,
  scoreBanked: number,
  isSixDiceFarkle = false,
  notifications?: BankScoreNotifications,
  translate: BankScoreTranslate = (key) => key
): Partial<BankScoreState> => {
  if (!state.game || state.game.isFinished || !state.game.currentPlayerIdTurn) {
    return state;
  }
  const currentPlayerId = state.game.currentPlayerIdTurn;
  const currentPlayer = state.game.players.find((player) => player.id === currentPlayerId);
  if (!currentPlayer) {
    return state;
  }

  const isMinimumFirstScoreEnabled = state.settings.minimumFirstScore.enabled;
  const minimumFirstScoreValue = state.settings.minimumFirstScore.score;
  const isFirstScore = !currentPlayer.hasScored;

  if (isMinimumFirstScoreEnabled && isFirstScore && scoreBanked < minimumFirstScoreValue) {
    notifications?.show({
      title: translate('game:bank.error.title'),
      message: translate('game:bank.error.message', { minimum: minimumFirstScoreValue }),
      position: 'top-center',
      color: 'red',
    });
    return state;
  }

  if (!canBankScore(state.game, state.settings, scoreBanked)) {
    return state;
  }

  const currentPlayerNewScore = currentPlayer.score + scoreBanked;
  let players = state.game.players.map((player) =>
    player.id === currentPlayerId
      ? {
          ...player,
          score: currentPlayerNewScore,
          previewScore: 0,
          hasScored: true,
          consecutiveFarkles: 0,
        }
      : player
  );

  const updatedPlayer = players.find((player) => player.id === currentPlayerId);
  const startsFinalRound =
    !state.game.finalRoundStartedByPlayerId &&
    Boolean(updatedPlayer && hasReachedWinningScore(state.game, updatedPlayer.score));
  const gameWithFinalRound = startsFinalRound
    ? { ...state.game, finalRoundStartedByPlayerId: currentPlayerId }
    : state.game;
  if (startsFinalRound) {
    notifications?.show({
      title: translate('game:lastRound.title'),
      message: translate('game:lastRound.message'),
      position: 'top-center',
      color: 'orange',
    });
  }

  if (state.settings.revertPlayerScoreOnSameScore && !state.game.finalRoundStartedByPlayerId) {
    const history: Game[] = getOrCreateArray<Game[]>(state.history);
    players = players.map((player) => {
      if (player.id === currentPlayerId) {
        return player;
      }
      if (player.score === currentPlayerNewScore) {
        notifications?.show({
          title: translate('settings:settings.revertPlayerScoreOnSameScore.title'),
          message: translate('settings:settings.revertPlayerScoreOnSameScore.alertMesage'),
          position: 'top-center',
          color: 'orange',
          autoClose: 6000,
        });
        const previousGame = [...history].reverse().find((game) => {
          const prevPlayer = game.players.find((p) => p.id === player.id);
          return prevPlayer && prevPlayer.score !== player.score;
        });
        const previousPlayer = previousGame?.players.find((p) => p.id === player.id);
        return previousPlayer ? { ...player, score: previousPlayer.score } : player;
      }
      return player;
    });
  }

  const newTurnResult: TurnResult = {
    playerId: currentPlayerId,
    playerName: currentPlayer.name,
    scoreBanked,
    isFarkle: false,
    ...(isSixDiceFarkle ? { isSixDiceFarkle: true } : {}),
    timestamp: Date.now(),
  };

  return {
    history: [...getOrCreateArray<Game[]>(state.history), state.game],
    turnHistory: [...(state.turnHistory || []), newTurnResult],
    game: {
      ...gameWithFinalRound,
      ...advanceTurn(gameWithFinalRound),
      players,
    },
  };
};
