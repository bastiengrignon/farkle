import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import type { DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import type { TFunction } from 'i18next';
import { v4 as uuidv4 } from 'uuid';

import { formRootRule, hasLength, isNotEmpty, useForm } from '@mantine/form';

import { type Game, replaceRouteParams } from '@farkle/core';
import { useFarkleStore } from '@store/farkle';

import { routes } from '../../router';

interface ModalFarkleNewGameHooksProps {
  t: TFunction;
}

export const useModalNewGameHooks = ({ t }: ModalFarkleNewGameHooksProps) => {
  const navigate = useNavigate();
  const commonPlayers = useFarkleStore((state) => state.players);
  const startNewGame = useFarkleStore((state) => state.startNewGame);
  const newGameForm = useForm<Omit<Game, 'currentPlayerIdTurn'>>({
    initialValues: {
      id: uuidv4(),
      players: commonPlayers.map(({ name }) => ({
        id: uuidv4(),
        name,
        score: 0,
        previewScore: 0,
        hasScored: false,
        consecutiveFarkles: 0,
      })),
      scoreToReach: 10_000,
      exactScoreRequired: true,
    },
    validateInputOnBlur: true,
    validate: {
      players: {
        [formRootRule]: hasLength({ min: 2 }, t('newGame.twoPlayersMinimum')),
        name: isNotEmpty('Name is required'),
      },
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: no Mantine form in dependency
  const handleReorderPlayers = useCallback((event: DragEndEvent) => {
    if (event.canceled) return;
    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source;
      if (initialIndex !== index) {
        newGameForm.reorderListItem('players', { from: initialIndex, to: index });
      }
    }
  }, []);

  const handleSubmitNewGame = useCallback(
    (game: Omit<Game, 'currentPlayerIdTurn'>) => {
      startNewGame(game);
      navigate(replaceRouteParams(routes.game, { gameId: game.id }));
    },
    [navigate, startNewGame]
  );

  return {
    newGameForm,
    resetFormOnClose: newGameForm.reset,
    handleSubmitNewGame,
    handleReorderPlayers,
  };
};
