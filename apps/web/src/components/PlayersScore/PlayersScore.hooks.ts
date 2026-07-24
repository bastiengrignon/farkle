import { useCallback, useMemo } from 'react';

import { DEFAULT_THEME } from '@mantine/core';

import type { Game, TurnResult } from '@farkle/core';

type PlayerTurnStats = {
  banked: number;
  farkles: number;
};

const DEFAULT_MANTINE_COLORS = Object.keys(DEFAULT_THEME.colors).filter(
  (color) => color !== 'dark' && color !== 'gray'
);

const getRandomizedPlayerColors = (playersCount: number): string[] =>
  [...DEFAULT_MANTINE_COLORS].sort(() => Math.random() - 0.5).slice(0, playersCount);

interface FarklePlayersScoreInputHooks {
  game: Game;
  turnHistory: TurnResult[];
}

export const usePlayersScoreHooks = ({ game, turnHistory }: FarklePlayersScoreInputHooks) => {
  const playerColors = useMemo(() => getRandomizedPlayerColors(game.players.length), [game.players.length]);

  const getPlayerTurnCount = useCallback(
    (playerId: string): PlayerTurnStats => {
      const playerTurns = turnHistory.filter((turn) => turn.playerId === playerId);
      return {
        banked: playerTurns.filter((turn) => !turn.isFarkle).length,
        farkles: playerTurns.filter((turn) => turn.isFarkle).length,
      };
    },
    [turnHistory]
  );

  return {
    playerColors,
    getPlayerTurnCount,
  };
};
