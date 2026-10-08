import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import type { DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import type { TFunction } from 'i18next';
import { v4 as uuidv4 } from 'uuid';

import { formRootRule, isNotEmpty, useForm } from '@mantine/form';

import { type Game, replaceRouteParams } from '@farkle/core';
import { useFarkleStore } from '@store/farkle';

import { routes } from '../../router';

export type NewGameFormValues = Omit<Game, 'currentPlayerIdTurn' | 'players'> & {
  players: (Game['players'][number] & { selected: boolean })[];
};

interface ModalFarkleNewGameHooksProps {
  t: TFunction;
}

export const useModalNewGameHooks = ({ t }: ModalFarkleNewGameHooksProps) => {
  const navigate = useNavigate();
  const commonPlayers = useFarkleStore((state) => state.players);
  const startNewGame = useFarkleStore((state) => state.startNewGame);
  const newGameForm = useForm<NewGameFormValues>({
    initialValues: {
      id: uuidv4(),
      players: commonPlayers.map(({ name }, index) => ({
        selected: index < 2,
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
        [formRootRule]: (players) =>
          players.filter((player) => player.selected).length < 2 ? t('newGame.twoPlayersMinimum') : null,
        name: (value, values, path) =>
          values.players[Number(path.split('.')[1])].selected ? isNotEmpty('Name is required')(value) : null,
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
    (values: NewGameFormValues) => {
      const game: Omit<Game, 'currentPlayerIdTurn'> = {
        ...values,
        players: values.players.filter((player) => player.selected).map(({ selected: _selected, ...player }) => player),
      };
      startNewGame(game);
      navigate(replaceRouteParams(routes.game.id, { gameId: game.id }));
    },
    [navigate, startNewGame]
  );

  return {
    newGameForm,
    selectedPlayerCount: newGameForm.values.players.filter((player) => player.selected).length,
    resetFormOnClose: newGameForm.reset,
    handleSubmitNewGame,
    handleReorderPlayers,
  };
};
