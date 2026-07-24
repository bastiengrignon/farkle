import { useMemo } from 'react';

import type { Game, TurnResult } from '@farkle/core';

interface TurnRow {
  turnIndex: number;
  turnNumber: number;
}

interface ModalTurnHistoryInputHooks {
  turnHistory: TurnResult[];
  playerId?: string;
  game: Game;
}

export const useModalTurnHistoryHooks = ({ turnHistory, playerId, game }: ModalTurnHistoryInputHooks) => {
  const filteredHistory = useMemo(
    () =>
      (playerId ? turnHistory.filter((turn) => turn.playerId === playerId) : turnHistory).toSorted(
        (a, b) => a.timestamp - b.timestamp
      ),
    [playerId, turnHistory]
  );

  const filteredPlayers = playerId ? game.players.filter((player) => player.id === playerId) : game.players;

  const allPlayers = useMemo(() => {
    const players = new Map<string, { name: string; turns: TurnResult[] }>();

    filteredPlayers.forEach((player) => {
      players.set(player.id, { name: player.name, turns: [] });
    });

    filteredHistory.forEach((turn) => {
      if (players.has(turn.playerId)) {
        players.get(turn.playerId)?.turns.push(turn);
      }
    });

    return Array.from(players.values());
  }, [filteredPlayers, filteredHistory]);

  const maxTurns = useMemo(() => Math.max(...allPlayers.map(({ turns }) => turns.length), 0), [allPlayers]);

  const records = useMemo<TurnRow[]>(
    () =>
      Array.from({ length: maxTurns }, (_, turnIndex) => ({
        turnIndex,
        turnNumber: turnIndex + 1,
      })),
    [maxTurns]
  );

  return {
    records,
    allPlayers,
  };
};
