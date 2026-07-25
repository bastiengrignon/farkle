import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbDice1 } from 'react-icons/tb';

import { DragDropProvider } from '@dnd-kit/react';
import { v4 as uuidv4 } from 'uuid';

import { Button, Flex, Modal, NumberInput, Stack, Switch, Text } from '@mantine/core';

import PlayerList from '@components/PlayerList';

import { useModalNewGameHooks } from './ModalNewGame.hooks';

interface ModalNewGameProps {
  opened: boolean;
  close: () => void;
}

const ModalNewGame: FC<ModalNewGameProps> = ({ opened, close }) => {
  const { t } = useTranslation('game');
  const { newGameForm, resetFormOnClose, handleSubmitNewGame, handleReorderPlayers } = useModalNewGameHooks({ t });

  return (
    <Modal opened={opened} onClose={close} onExitTransitionEnd={resetFormOnClose} title={t('newGame.title')} size="sm">
      <form onSubmit={newGameForm.onSubmit(handleSubmitNewGame)}>
        <Stack>
          <div>
            <Button
              onClick={() =>
                newGameForm.insertListItem('players', {
                  id: uuidv4(),
                  name: '',
                  score: 0,
                  previewScore: 0,
                  hasScored: false,
                  consecutiveFarkles: 0,
                })
              }
            >
              {t('newGame.addPlayer')}
            </Button>
            {newGameForm.values.players.length < 2 && (
              <Text mt="xs" size="xs" c="red">
                {t('newGame.twoPlayersMinimum')}
              </Text>
            )}
          </div>
          <DragDropProvider onDragEnd={handleReorderPlayers}>
            <Stack gap="xs" mt="xs">
              {newGameForm.values.players.map((player, index) => (
                <PlayerList key={player.id} player={player} index={index} form={newGameForm} />
              ))}
            </Stack>
          </DragDropProvider>
          <NumberInput thousandSeparator=" " step={50} {...newGameForm.getInputProps('scoreToReach')} />
          <Switch
            {...newGameForm.getInputProps('exactScoreRequired', { type: 'checkbox' })}
            label={t('newGame.exactScoreRequired')}
          />
          <Flex justify="flex-end">
            <Button type="submit" disabled={newGameForm.values.players.length < 2} rightSection={<TbDice1 />}>
              {t('newGame.start')}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default ModalNewGame;
