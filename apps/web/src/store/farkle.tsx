import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand/react';

import { notifications } from '@mantine/notifications';

import {
  advanceTurn,
  bankScore,
  DEFAULT_FARKLE_SETTINGS,
  type FarkleState,
  type FinishedGame,
  type Game,
  getOrCreateArray,
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
            if (!state.settings.sixDiceFarkle.enabled) {
              return state;
            }
            return bankScore(state, state.settings.sixDiceFarkle.score, true, notifications, i18n.t);
          }),
        bank: () =>
          set((state) => {
            const currentPlayer = state.game?.players.find((player) => player.id === state.game?.currentPlayerIdTurn);
            return bankScore(state, currentPlayer?.previewScore ?? 0, false, notifications, i18n.t);
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
