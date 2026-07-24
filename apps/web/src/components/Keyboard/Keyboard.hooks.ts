import { useMemo } from 'react';

import { useFarkleStore } from '@store/farkle';

export const useKeyboardHooks = () => {
  const game = useFarkleStore((state) => state.game);
  const settings = useFarkleStore((state) => state.settings);
  const farkle = useFarkleStore((state) => state.farkle);
  const sixDiceFarkle = useFarkleStore((state) => state.sixDiceFarkle);
  const bank = useFarkleStore((state) => state.bank);

  const canCurrentPlayerScore = useMemo(() => {
    const currentPlayer = game?.players.find((player) => player.id === game?.currenPlayerIdTurn);
    return Boolean(
      currentPlayer &&
        game &&
        currentPlayer.previewScore > 0 &&
        (!game.exactScoreRequired || currentPlayer.score + currentPlayer.previewScore <= game.scoreToReach)
    );
  }, [game]);

  return {
    canCurrentPlayerScore,
    settings,
    farkle,
    sixDiceFarkle,
    bank,
  };
};
