import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbChevronDown, TbChevronUp, TbDice1, TbX } from 'react-icons/tb';

import { v4 as uuidv4 } from 'uuid';

import { ActionIcon, Button, Flex, Group, Modal, NumberInput, Stack, Switch, Text, TextInput } from '@mantine/core';

import { useModalNewGameHooks } from './ModalNewGame.hooks';

interface ModalNewGameProps {
  opened: boolean;
  close: () => void;
}

const ModalNewGame: FC<ModalNewGameProps> = ({ opened, close }) => {
  const { t } = useTranslation('game');
  const { newGameForm, resetFormOnClose, handleSubmitNewGame } = useModalNewGameHooks({ t });

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
          <Stack gap="xs" mt="xs">
            {newGameForm.values.players.map((player, index) => (
              <Group gap="xs" key={player.id}>
                <TextInput
                  placeholder={`Player ${index + 1}`}
                  {...newGameForm.getInputProps(`players.${index}.name`)}
                />
                <ActionIcon
                  disabled={index === 0}
                  onClick={() => newGameForm.reorderListItem('players', { from: index, to: index - 1 })}
                >
                  <TbChevronUp />
                </ActionIcon>
                <ActionIcon
                  disabled={index === newGameForm.values.players.length - 1}
                  onClick={() => newGameForm.reorderListItem('players', { from: index, to: index + 1 })}
                >
                  <TbChevronDown />
                </ActionIcon>
                <ActionIcon color="red" onClick={() => newGameForm.removeListItem('players', index)}>
                  <TbX />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
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
