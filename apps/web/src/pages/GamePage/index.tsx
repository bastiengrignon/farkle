import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbHistory, TbLogout } from 'react-icons/tb';

import { ActionIcon, Box, Button, Group, Modal } from '@mantine/core';

import Keyboard from '@components/Keyboard';
import ModalTurnHistory from '@components/ModalTurnHistory';
import PlayersScore from '@components/PlayersScore';
import { UMAMI_EVENTS } from '@constants/umami';

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

  return (
    <Box className={classes.gamePageContainer}>
      <Group gap="sm" justify="flex-end">
        <ActionIcon data-umami-event={UMAMI_EVENTS.OPEN_TURN_HISTORY} onClick={() => handleOpenHistoryModal()}>
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
