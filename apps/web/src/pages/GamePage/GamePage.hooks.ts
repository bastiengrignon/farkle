import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useDisclosure } from '@mantine/hooks';

import { useFarkleStore } from '@store/farkle';

import { routes } from '../../router';

export const useGamePageHooks = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const game = useFarkleStore((state) => state.game);
  const turnHistory = useFarkleStore((state) => state.turnHistory);
  const resetGame = useFarkleStore((state) => state.resetGame);
  const finishGame = useFarkleStore((state) => state.finishGame);

  const [openedLeaveGameModal, { open: openLeaveGameModal, close: closeLeaveGameModal }] = useDisclosure(false);
  const [openedHistoryModal, { open: openHistoryModal, close: closeHistoryModal }] = useDisclosure(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const handleOpenHistoryModal = useCallback(
    (playerId?: string) => {
      setSelectedPlayerId(playerId || null);
      openHistoryModal();
    },
    [openHistoryModal]
  );

  const clearDataOnModalExit = useCallback(() => setSelectedPlayerId(null), []);

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
    if (!game || game.id !== gameId) {
      handleLeaveGame();
    }
  }, [game, gameId, handleLeaveGame]);

  return {
    game,
    openedLeaveGameModal,
    openedHistoryModal,
    selectedPlayerId,
    turnHistory,
    openLeaveGameModal,
    closeLeaveGameModal,
    handleLeaveGame,
    handleOpenHistoryModal,
    closeHistoryModal,
    clearDataOnModalExit,
  };
};
