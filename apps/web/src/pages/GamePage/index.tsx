import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbHistory, TbLogout } from 'react-icons/tb';

import confetti from '@hiseb/confetti';

import {
  ActionIcon,
  Box,
  Button,
  Center,
  DEFAULT_THEME,
  Flex,
  Group,
  Modal,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import Keyboard from '@components/Keyboard';
import ModalTurnHistory from '@components/ModalTurnHistory';
import PlayersScore from '@components/PlayersScore';

import { useGamePageHooks } from './GamePage.hooks';
import classes from './GamePage.module.css';

const GamePage: FC = () => {
  const { t } = useTranslation('game');
  const {
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
  } = useGamePageHooks();

  if (!game) {
    return null;
  }

  if (game.isFinished) {
    const winners = game.players.filter((player) =>
      game.exactScoreRequired ? player.score === game.scoreToReach : player.score >= game.scoreToReach
    );
    confetti({
      color: Object.values(DEFAULT_THEME.colors).map((color) => color[5]),
      count: 150,
      fade: false,
    });

    return (
      <Center p="md" mih="calc(100dvh - var(--app-shell-header-offset, 0rem))">
        <Stack w="100%" maw={500}>
          <Title order={2} ta="center">
            {t('finished.winner', { count: winners.length })}
          </Title>
          {winners.map((winner) => (
            <Paper key={winner.id} withBorder p="md">
              <Flex justify="space-between" align="center">
                <Text fw="bold">{winner.name}</Text>
                <NumberFormatter value={winner.score} thousandSeparator=" " />
              </Flex>
            </Paper>
          ))}
          <Button fullWidth mt="md" onClick={handleLeaveGame}>
            {t('newGame.title')}
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Box className={classes.gamePageContainer}>
      <Group gap="sm" justify="flex-end">
        <ActionIcon onClick={() => handleOpenHistoryModal()}>
          <TbHistory />
        </ActionIcon>
        <ActionIcon color="red" onClick={openLeaveGameModal}>
          <TbLogout />
        </ActionIcon>
      </Group>
      <PlayersScore game={game} turnHistory={turnHistory} onPlayerClick={handleOpenHistoryModal} />
      <Keyboard />
      <Modal centered opened={openedLeaveGameModal} onClose={closeLeaveGameModal} title={t('leave.title')}>
        <Group gap="xs" justify="flex-end">
          <Button variant="outline" color="red" onClick={handleLeaveGame}>
            {t('leave.button')}
          </Button>
          <Button onClick={closeLeaveGameModal}>{t('common:cancel')}</Button>
        </Group>
      </Modal>
      <ModalTurnHistory
        opened={openedHistoryModal}
        onClose={closeHistoryModal}
        clearDataOnExit={clearDataOnModalExit}
        game={game}
        turnHistory={turnHistory}
        playerId={selectedPlayerId || undefined}
      />
    </Box>
  );
};

export default GamePage;
