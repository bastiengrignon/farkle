import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PieChart } from '@mantine/charts';
import { Center, DEFAULT_THEME, Fieldset, Flex, SimpleGrid, Stack, Text } from '@mantine/core';
import { DataTable, type DataTableColumn } from 'mantine-datatable';

import LeaderboardSectionTitle from '@components/LeaderboardSectionTitle';
import WinnerPodium from '@components/WinnerPodium';
import type { FinishedGame } from '@farkle/core';
import PageLayout from '@pages/PageLayout';

import { useLeaderboardHooks } from './Leaderboard.hooks';

const getUniqueRandomColors = Object.keys(DEFAULT_THEME.colors)
  .filter((key) => !['dark', 'gray', 'cyan', 'indigo', 'lime', 'teal'].includes(key))
  .sort((a, b) => a.localeCompare(b))
  .flatMap((key) => DEFAULT_THEME.colors[key][6]);

const Leaderboard: FC = () => {
  const { t } = useTranslation('leaderboard');
  const {
    sortedFinishedGames,
    topWinners,
    mostFarklers,
    mostFarklesInOneGame,
    mostFarklesInARow,
    sortStatus,
    setSortStatus,
  } = useLeaderboardHooks();

  const columns = useMemo<DataTableColumn<FinishedGame>[]>(
    () => [
      {
        accessor: 'gameNumber',
        title: t('leaderboard.gameNumberShort', { defaultValue: '#' }),
        width: 60,
        textAlign: 'center',
        sortable: true,
        render: (_, index) => index + 1,
      },
      {
        accessor: 'winners',
        title: t('leaderboard.winners'),
        width: 200,
        render: ({ winnerNames }) => winnerNames.join(', '),
      },
      {
        accessor: 'players',
        title: t('leaderboard.players'),
        width: 250,
        render: ({ players }) => (
          <Stack gap="xs">
            {players.map((player) => (
              <Flex key={player.id} justify="space-between">
                <Text size="sm">{player.name}</Text>
                <Text size="sm" fw="bold">
                  {player.score.toLocaleString()}
                </Text>
              </Flex>
            ))}
          </Stack>
        ),
      },
      {
        accessor: 'targetScore',
        title: t('leaderboard.scoreToReach'),
        width: 120,
        textAlign: 'right',
        render: ({ scoreToReach }) => scoreToReach.toLocaleString(),
      },
      {
        accessor: 'date',
        title: t('leaderboard.date'),
        width: 180,
        sortable: true,
        render: ({ timestamp }) =>
          new Intl.DateTimeFormat('fr', {
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
          }).format(timestamp),
      },
    ],
    [t]
  );

  return (
    <PageLayout title={t('common:home.leaderboard')}>
      <Stack>
        {/* Podium for top 3 winners */}
        {topWinners.length > 0 && (
          <Fieldset legend={<LeaderboardSectionTitle title={t('leaderboard.topWinners')} />}>
            <WinnerPodium winners={topWinners} t={t} />
          </Fieldset>
        )}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {mostFarklers.length > 0 && (
            <Fieldset legend={<LeaderboardSectionTitle title={t('leaderboard.topFarklers')} />}>
              <Center>
                <PieChart
                  data={mostFarklers.map(({ name, count }, index) => ({
                    name,
                    value: count,
                    color: getUniqueRandomColors[index % mostFarklers.length],
                  }))}
                  withTooltip
                  tooltipDataSource="segment"
                  withLabels
                  labelsPosition="inside"
                  labelsType="name"
                  size={200}
                />
              </Center>
            </Fieldset>
          )}
          {mostFarklesInOneGame.length > 0 && (
            <Fieldset legend={<LeaderboardSectionTitle title={t('leaderboard.mostFarklesInOneGameTitle')} />}>
              <Center>
                <PieChart
                  data={mostFarklesInOneGame.map(({ name, count }, index) => ({
                    name,
                    value: count,
                    color: getUniqueRandomColors[index % mostFarklesInOneGame.length],
                  }))}
                  withTooltip
                  tooltipDataSource="segment"
                  withLabelsLine
                  labelsPosition="inside"
                  labelsType="name"
                  withLabels
                  size={200}
                />
              </Center>
            </Fieldset>
          )}
          {mostFarklesInARow.length > 0 && (
            <Fieldset legend={<LeaderboardSectionTitle title={t('leaderboard.mostFarklesInARowTitle')} />}>
              <Center>
                <PieChart
                  data={mostFarklesInARow.map(({ name, count }, index) => ({
                    name,
                    value: count,
                    color: getUniqueRandomColors[index % mostFarklesInARow.length],
                  }))}
                  withTooltip
                  tooltipDataSource="segment"
                  withLabelsLine
                  labelsPosition="inside"
                  labelsType="name"
                  withLabels
                  size={200}
                />
              </Center>
            </Fieldset>
          )}
        </SimpleGrid>

        <Fieldset legend={<LeaderboardSectionTitle title={t('leaderboard.gameList')} />}>
          <DataTable
            withTableBorder
            withColumnBorders
            borderRadius="md"
            striped
            highlightOnHover
            height={450}
            columns={columns}
            noRecordsText={t('leaderboard.noGames')}
            records={sortedFinishedGames}
            idAccessor="id"
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
          />
        </Fieldset>
      </Stack>
    </PageLayout>
  );
};

export default Leaderboard;
