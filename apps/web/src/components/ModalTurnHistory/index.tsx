import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Modal, Text } from '@mantine/core';
import { DataTable, type DataTableColumn } from 'mantine-datatable';

import type { Game, TurnResult } from '@farkle/core';

import { useModalTurnHistoryHooks } from './ModalTurnHistory.hooks';

interface ModalTurnHistoryProps {
  opened: boolean;
  onClose: () => void;
  game: Game;
  turnHistory: TurnResult[];
  playerId?: string;
  clearDataOnExit: () => void;
}

interface TurnRow {
  turnIndex: number;
  turnNumber: number;
}

const ModalTurnHistory: FC<ModalTurnHistoryProps> = ({
  opened,
  onClose,
  game,
  turnHistory,
  playerId,
  clearDataOnExit,
}) => {
  const { t } = useTranslation('game');

  const { records, allPlayers } = useModalTurnHistoryHooks({ turnHistory, playerId, game });
  const columns = useMemo<DataTableColumn<TurnRow>[]>(
    () => [
      {
        accessor: 'turnNumber',
        title: t('turnHistory.turn'),
        width: 80,
      },
      ...allPlayers.map((player) => ({
        accessor: player.name,
        title: player.name,
        render: (row: TurnRow) => {
          if (row.turnIndex >= player.turns.length) {
            return <Text c="dimmed">-</Text>;
          }
          const turn = player.turns[row.turnIndex];
          return turn.isFarkle ? (
            <Text c="red" fw="bold">
              {t('turnHistory.farkle')}
              {turn.consecutiveFarklePenalty && (
                <Text span c="dimmed">
                  {` (-${turn.consecutiveFarklePenalty})`}
                </Text>
              )}
            </Text>
          ) : (
            <Text c="green" fw="bold">
              +{turn.scoreBanked}
              {turn.isSixDiceFarkle ? `(${t('settings:settings.sixDiceFarkle.title')})` : null}
            </Text>
          );
        },
      })),
    ],
    [t, allPlayers]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={clearDataOnExit}
      title={t('turnHistory.title')}
      size="lg"
    >
      <Box>
        <DataTable
          withTableBorder
          withColumnBorders
          borderRadius="sm"
          striped
          highlightOnHover
          height={400}
          columns={columns}
          noRecordsText={t('turnHistory.noTurns')}
          records={records}
          idAccessor={(row) => `turn-${row.turnIndex}`}
        />
      </Box>
    </Modal>
  );
};

export default ModalTurnHistory;
