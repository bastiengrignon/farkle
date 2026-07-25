import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand/react';

import { notifications } from '@mantine/notifications';

import {
  advanceTurn,
  DEFAULT_FARKLE_SETTINGS,
  type FarkleState,
  type FinishedGame,
  type Game,
  getOrCreateArray,
  hasReachedWinningScore,
  type TurnResult,
} from '@farkle/core';

import i18n from '../i18n/config';

export const useFarkleStore = create<FarkleState>()(
  devtools(
    persist(
      (set) => ({
        players: [],
        game: null,
        settings: DEFAULT_FARKLE_SETTINGS,
        updateSettings: (settings) => set({ settings }),
        startNewGame: (game) =>
          set((state) => ({
            players: Array.from(
              new Set([...state.players.map((player) => player.name), ...game.players.map((player) => player.name)]),
              (name) => ({ name })
            ),
            game: {
              ...game,
              currentPlayerIdTurn: game.players.at(0)?.id ?? null,
              finalRoundStartedByPlayerId: null,
              isFinished: false,
            },
            history: [],
            turnHistory: [],
          })),
        resetGame: () => set(() => ({ game: null, history: [], turnHistory: [] })),
        finishGame: (winners: string[]) =>
          set((state) => {
            if (!state.game) {
              return state;
            }
            const finishedGame: FinishedGame = {
              id: state.game.id,
              players: state.game.players,
              scoreToReach: state.game.scoreToReach,
              exactScoreRequired: state.game.exactScoreRequired,
              winnerNames: winners,
              timestamp: Date.now(),
              turnHistory: state.turnHistory,
            };
            return {
              finishedGames: [...getOrCreateArray<FinishedGame[]>(state.finishedGames), finishedGame],
              game: null,
              history: [],
              turnHistory: [],
            };
          }),
        addPointsToPlayer: (score: number) =>
          set((state) => {
            if (!state.game || state.game.isFinished || !state.game.currentPlayerIdTurn) {
              return state;
            }
            return {
              history: [...getOrCreateArray<Game[]>(state.history), state.game],
              game: {
                ...state.game,
                players: [...state.game.players].map((player) =>
                  player.id === state.game?.currentPlayerIdTurn
                    ? {
                        ...player,
                        previewScore: player.previewScore + score,
                      }
                    : player
                ),
              },
            };
          }),
        nextPlayer: () =>
          set((state) => {
            if (
              !state.game ||
              state.game.isFinished ||
              !state.game.currentPlayerIdTurn ||
              state.game.players.length === 0
            ) {
              return state;
            }

            return {
              history: [...getOrCreateArray<Game[]>(state.history), state.game],
              game: {
                ...state.game,
                ...advanceTurn(state.game),
              },
            };
          }),
        undoLastAction: () =>
          set((state) => {
            const history = getOrCreateArray<Game[]>(state.history);
            const previousGame = history.at(-1);

            if (!previousGame) {
              return state;
            }

            return {
              game: previousGame,
              history: history.slice(0, -1),
              turnHistory: state.turnHistory.slice(0, -1),
            };
          }),
        farkle: () =>
          set((state) => {
            if (!state.game || state.game.isFinished || !state.game.currentPlayerIdTurn) {
              return state;
            }
            const currentPlayerId = state.game.currentPlayerIdTurn;
            const currentPlayer = state.game.players.find((player) => player.id === currentPlayerId);

            const consecutiveFarkleEnabled = state.settings.consecutiveFarkle.enabled;
            const scorePenalty = state.settings.consecutiveFarkle.scorePenalty;
            const newConsecutiveFarkles = (currentPlayer?.consecutiveFarkles ?? 0) + 1;
            const isThirdConsecutive = consecutiveFarkleEnabled && newConsecutiveFarkles === 3;

            if (isThirdConsecutive) {
              notifications.show({
                title: i18n.t('settings:settings.threeConsecutiveFarkle.title'),
                message: i18n.t('settings:settings.threeConsecutiveFarkle.alertMessage', { points: scorePenalty }),
                autoClose: 6000,
                position: 'top-center',
                color: 'orange',
              });
            }

            const newTurnResult: TurnResult = {
              playerId: currentPlayerId,
              playerName: currentPlayer?.name || 'Unknown',
              scoreBanked: null,
              isFarkle: true,
              timestamp: Date.now(),
              consecutiveFarklePenalty: isThirdConsecutive ? scorePenalty : undefined,
            };

            return {
              history: [...getOrCreateArray<Game[]>(state.history), state.game],
              turnHistory: [...(state.turnHistory || []), newTurnResult],
              game: {
                ...state.game,
                ...advanceTurn(state.game),
                players: state.game.players.map((player) =>
                  player.id === currentPlayerId
                    ? {
                        ...player,
                        previewScore: 0,
                        hasScored: player.score > 0 ? player.hasScored : false,
                        consecutiveFarkles: isThirdConsecutive ? 0 : newConsecutiveFarkles,
                        score: isThirdConsecutive ? Math.max(0, player.score - scorePenalty) : player.score,
                      }
                    : player
                ),
              },
            };
          }),
        sixDiceFarkle: () =>
          set((state) => {
            if (
              !state.game ||
              state.game.isFinished ||
              !state.game.currentPlayerIdTurn ||
              !state.settings.sixDiceFarkle.enabled
            ) {
              return state;
            }
            const currentPlayerId = state.game.currentPlayerIdTurn;
            const currentPlayer = state.game.players.find((player) => player.id === currentPlayerId);

            const newTurnResult: TurnResult = {
              playerId: currentPlayerId,
              playerName: currentPlayer?.name || 'Unknown',
              scoreBanked: state.settings.sixDiceFarkle.score,
              isSixDiceFarkle: true,
              isFarkle: false,
              timestamp: Date.now(),
            };
            const players = state.game.players.map((player) =>
              player.id === currentPlayerId
                ? {
                    ...player,
                    score: player.score + state.settings.sixDiceFarkle.score,
                    previewScore: 0,
                    hasScored: player.score === 0 ? true : player.hasScored,
                    consecutiveFarkles: 0,
                  }
                : player
            );

            return {
              history: [...getOrCreateArray<Game[]>(state.history), state.game],
              turnHistory: [...(state.turnHistory || []), newTurnResult],
              game: {
                ...state.game,
                ...advanceTurn(state.game),
                players,
              },
            };
          }),
        bank: () =>
          set((state) => {
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
            const isFirstScore = currentPlayer.score === 0 && currentPlayer.previewScore > 0;

            if (isMinimumFirstScoreEnabled && isFirstScore && currentPlayer.previewScore < minimumFirstScoreValue) {
              notifications.show({
                title: i18n.t('game:bank.error.title'),
                message: i18n.t('game:bank.error.message', { minimum: minimumFirstScoreValue }),
                position: 'top-center',
                color: 'red',
                autoClose: false,
              });
              return state;
            }

            const scoreBanked = currentPlayer.previewScore;
            const currentPlayerNewScore = currentPlayer.score + currentPlayer.previewScore;
            let players = state.game.players.map((player) =>
              player.id === currentPlayerId
                ? {
                    ...player,
                    score: currentPlayerNewScore,
                    previewScore: 0,
                    hasScored: player.score === 0 ? true : player.hasScored,
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
              notifications.show({
                title: i18n.t('game:lastRound.title'),
                message: i18n.t('game:lastRound.message'),
                position: 'top-center',
                color: 'orange',
                autoClose: false,
              });
            }

            if (state.settings.revertPlayerScoreOnSameScore && !state.game.finalRoundStartedByPlayerId) {
              const history = getOrCreateArray<Game[]>(state.history);
              players = players.map((player) => {
                if (player.id === currentPlayerId) {
                  return player;
                }
                if (player.score === currentPlayerNewScore) {
                  notifications.show({
                    title: i18n.t('settings:settings.revertPlayerScoreOnSameScore.title'),
                    message: i18n.t('settings:settings.revertPlayerScoreOnSameScore.alertMesage'),
                    position: 'top-center',
                    color: 'orange',
                    autoClose: 6000,
                  });
                  const previousGame = history.findLast((game) => {
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
          }),
        removeStoredPlayer: (playerName: string) =>
          set((state) => ({
            players: state.players.filter((player) => player.name !== playerName),
          })),
        clearPreviewScore: () =>
          set((state) => {
            if (!state.game?.currentPlayerIdTurn) {
              return state;
            }
            return {
              history: [...getOrCreateArray<Game[]>(state.history), state.game],
              game: {
                ...state.game,
                players: [...state.game.players].map((player) =>
                  player.id === state.game?.currentPlayerIdTurn
                    ? {
                        ...player,
                        previewScore: 0,
                        hasScored: player.score > 0 ? player.hasScored : false,
                      }
                    : player
                ),
              },
            };
          }),
        history: [],
        turnHistory: [],
        finishedGames: [],
      }),
      {
        name: 'farkle-storage',
        merge: (persistedState, currentState) => {
          const persisted = persistedState as Partial<FarkleState>;

          return {
            ...currentState,
            ...persisted,
            settings: {
              ...currentState.settings,
              ...persisted.settings,
              consecutiveFarkle: {
                ...currentState.settings.consecutiveFarkle,
                ...persisted.settings?.consecutiveFarkle,
              },
              sixDiceFarkle: {
                ...currentState.settings.sixDiceFarkle,
                ...persisted.settings?.sixDiceFarkle,
              },
              minimumFirstScore: {
                ...currentState.settings.minimumFirstScore,
                ...persisted.settings?.minimumFirstScore,
              },
              revertPlayerScoreOnSameScore:
                persisted.settings?.revertPlayerScoreOnSameScore ?? currentState.settings.revertPlayerScoreOnSameScore,
            },
            turnHistory: persisted.turnHistory || currentState.turnHistory,
            finishedGames: persisted.finishedGames || currentState.finishedGames,
          };
        },
      }
    )
  )
);
