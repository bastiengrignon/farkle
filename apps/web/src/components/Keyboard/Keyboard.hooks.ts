import { useMemo } from 'react';

import { canBankScore } from '@farkle/core';
import { useFarkleStore } from '@store/farkle';

export const useKeyboardHooks = () => {
  const game = useFarkleStore((state) => state.game);
  const settings = useFarkleStore((state) => state.settings);
  const farkle = useFarkleStore((state) => state.farkle);
  const sixDiceFarkle = useFarkleStore((state) => state.sixDiceFarkle);
  const bank = useFarkleStore((state) => state.bank);

  const canCurrentPlayerScore = useMemo(() => {
    const currentPlayer = game?.players.find((player) => player.id === game?.currentPlayerIdTurn);
    return canBankScore(game, settings, currentPlayer?.previewScore ?? 0);
  }, [game, settings]);

  const canCurrentPlayerSixDiceFarkle = useMemo(
    () => settings.sixDiceFarkle.enabled && canBankScore(game, settings, settings.sixDiceFarkle.score),
    [game, settings]
  );

  return {
    canCurrentPlayerScore,
    canCurrentPlayerSixDiceFarkle,
    settings,
    farkle,
    sixDiceFarkle,
    bank,
  };
};
