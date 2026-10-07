import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import confetti from '@hiseb/confetti';

import { DEFAULT_THEME } from '@mantine/core';
import { useInterval, useViewportSize } from '@mantine/hooks';

import { useFarkleStore } from '@store/farkle';

import { routes } from '../../router';

const confettiConfig = (width: number, height: number) => ({
  color: Object.values(DEFAULT_THEME.colors).map((color) => color[5]),
  count: 100,
  fade: false,
  velocity: 300,
  position: { x: width, y: height },
});

export const useGamePageEndHooks = () => {
  const navigate = useNavigate();
  const { width, height } = useViewportSize();
  const interval = useInterval(() => {
    confetti(confettiConfig(width, height));
    confetti(confettiConfig(0, height));
  }, 5000);

  const game = useFarkleStore((state) => state.game);
  const resetGame = useFarkleStore((state) => state.resetGame);
  const finishGame = useFarkleStore((state) => state.finishGame);

  const winners = useMemo(
    () =>
      game?.players.filter((player) =>
        game.exactScoreRequired ? player.score === game.scoreToReach : player.score >= game.scoreToReach
      ) || [],
    [game]
  );

  const handleLeaveGame = useCallback(() => {
    if (game?.isFinished) {
      const winners = game.players
        .filter((player) =>
          game.exactScoreRequired ? player.score === game.scoreToReach : player.score >= game.scoreToReach
        )
        .map((player) => player.name);
      if (winners.length > 0) {
        finishGame(winners);
      }
    } else {
      resetGame();
    }
    navigate(routes.home);
  }, [navigate, resetGame, finishGame, game]);

  useEffect(() => {
    confetti(confettiConfig(width, height));
    confetti(confettiConfig(0, height));
  }, [height, width]);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  return {
    winners,
    handleLeaveGame,
  };
};
