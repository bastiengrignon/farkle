import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TbTrophy } from 'react-icons/tb';

import { Box, Card, Flex, Group, Stack, Text, Title } from '@mantine/core';
import { DataTable, type DataTableColumn } from 'mantine-datatable';

import type { FinishedGame } from '@farkle/core';
import PageLayout from '@pages/PageLayout';

import { useLeaderboardHooks } from './Leaderboard.hooks.ts';

const Leaderboard: FC = () => {
  const { t } = useTranslation('leaderboard');
  const { sortedFinishedGames, topWinners, topFarklers, sortStatus, setSortStatus } = useLeaderboardHooks();

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
          <Card withBorder>
            <Title order={4} mb="md">
              <Group gap="xs">
                <TbTrophy />
                {t('leaderboard.topWinners')}
              </Group>
            </Title>
            <Flex direction="column" gap="sm">
              {topWinners.map((winner, index) => (
                <Flex
                  key={winner.name}
                  align="center"
                  gap="md"
                  p="sm"
                  style={{
                    backgroundColor:
                      index === 0
                        ? 'var(--mantine-color-yellow-1)'
                        : index === 1
                          ? 'var(--mantine-color-gray-1)'
                          : index === 2
                            ? 'var(--mantine-color-orange-1)'
                            : 'transparent',
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                >
                  <Text fw="bold" size="lg" c={index === 0 ? 'yellow.7' : index === 1 ? 'gray.7' : 'orange.7'}>
                    {index + 1}.
                  </Text>
                  <Text flex={1} fw={500}>
                    {winner.name}
                  </Text>
                  <Box
                    px="sm"
                    py="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-blue-light)',
                      borderRadius: 'var(--mantine-radius-md)',
                    }}
                  >
                    <Text fw="bold">{t('leaderboard.wins', { wins: winner.wins })}</Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Card>
        )}

        {/* Top 3 players with most farkles */}
        {topFarklers.length > 0 && (
          <Card withBorder>
            <Title order={4} mb="md">
              <Group gap="xs">
                <TbTrophy />
                {t('leaderboard.topFarklers')}
              </Group>
            </Title>
            <Flex direction="column" gap="sm">
              {topFarklers.map((farkler, index) => (
                <Flex
                  key={farkler.name}
                  align="center"
                  gap="md"
                  p="sm"
                  style={{
                    backgroundColor:
                      index === 0
                        ? 'var(--mantine-color-red-1)'
                        : index === 1
                          ? 'var(--mantine-color-gray-1)'
                          : index === 2
                            ? 'var(--mantine-color-orange-1)'
                            : 'transparent',
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                >
                  <Text fw="bold" size="lg" c={index === 0 ? 'red.7' : index === 1 ? 'gray.7' : 'orange.7'}>
                    {index + 1}.
                  </Text>
                  <Text flex={1} fw={500}>
                    {farkler.name}
                  </Text>
                  <Box
                    px="sm"
                    py="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-red-light)',
                      borderRadius: 'var(--mantine-radius-md)',
                    }}
                  >
                    <Text fw="bold">{t('leaderboard.farkles', { count: farkler.count })}</Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Card>
        )}

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
      </Stack>
    </PageLayout>
  );
};

export default Leaderboard;
