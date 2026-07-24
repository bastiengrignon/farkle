import { useCallback } from 'react';
import { useNavigate } from 'react-router';

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
  const newGameForm = useForm<Omit<Game, 'currenPlayerIdTurn'>>({
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

  const handleSubmitNewGame = useCallback(
    (game: Omit<Game, 'currenPlayerIdTurn'>) => {
      startNewGame(game);
      navigate(replaceRouteParams(routes.game, { gameId: game.id }));
    },
    [navigate, startNewGame]
  );

  return {
    newGameForm,
    resetFormOnClose: newGameForm.reset,
    handleSubmitNewGame,
  };
};
