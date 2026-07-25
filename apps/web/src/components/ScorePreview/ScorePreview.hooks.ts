import { useMemo } from 'react';

import { useFarkleStore } from '@store/farkle';

export const useScorePreviewHooks = () => {
  const game = useFarkleStore((state) => state.game);
  const settings = useFarkleStore((state) => state.settings);
  const clearPreviewScore = useFarkleStore((state) => state.clearPreviewScore);

  const currentPlayer = useMemo(
    () => [...(game?.players || [])].find((player) => player.id === game?.currentPlayerIdTurn),
    [game?.currentPlayerIdTurn, game?.players]
  );

  const previewScore = useMemo(
    () => (currentPlayer?.score || 0) + (currentPlayer?.previewScore || 0),
    [currentPlayer?.previewScore, currentPlayer?.score]
  );

  const isMinimumFirstScoreEnabled = settings.minimumFirstScore.enabled;
  const minimumFirstScoreValue = settings.minimumFirstScore.score;

  const isFirstScore = useMemo(
    () => currentPlayer && currentPlayer.score === 0 && currentPlayer.previewScore > 0,
    [currentPlayer]
  );

  const isBelowMinimumFirstScore = useMemo(
    () =>
      isMinimumFirstScoreEnabled &&
      isFirstScore &&
      currentPlayer &&
      currentPlayer.previewScore < minimumFirstScoreValue,
    [isMinimumFirstScoreEnabled, isFirstScore, currentPlayer, minimumFirstScoreValue]
  );

  return {
    game,
    settings,
    previewScore,
    currentPlayer,
    isBelowMinimumFirstScore,
    clearPreviewScore,
  };
};
