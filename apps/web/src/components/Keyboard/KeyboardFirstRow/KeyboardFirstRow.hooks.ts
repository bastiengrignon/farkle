import { useCallback, useState } from 'react';

import { useDisclosure } from '@mantine/hooks';

import { FARKLE_SCORES } from '@farkle/core';
import { useFarkleStore } from '@store/farkle';

export const useKeyboardFirstRowHooks = () => {
  const undoAction = useFarkleStore((state) => state.undoLastAction);
  const canUndo = useFarkleStore((state) => Array.isArray(state.history) && state.history.length > 0);
  const addCurrentPlayerPoints = useFarkleStore((state) => state.addPointsToPlayer);

  const [openedDiceModal, { open: openDiceModal, close: closeDiceModal }] = useDisclosure(false);
  const [diceType, setDiceType] = useState<'3' | '4' | null>(null);

  const handleOpenDiceSelection = useCallback(
    (type: '3' | '4') => {
      setDiceType(type);
      openDiceModal();
    },
    [openDiceModal]
  );

  const handleSetNumberOfDicePoints = useCallback(
    (number: number) => {
      addCurrentPlayerPoints(diceType === '3' ? FARKLE_SCORES.THREE_DICE(number) : FARKLE_SCORES.FOUR_DICE(number));
      closeDiceModal();
    },
    [addCurrentPlayerPoints, diceType, closeDiceModal]
  );

  return {
    openedDiceModal,
    canUndo,
    diceType,
    addCurrentPlayerPoints,
    handleOpenDiceSelection,
    handleSetNumberOfDicePoints,
    undoAction,
    closeDiceModal,
  };
};
