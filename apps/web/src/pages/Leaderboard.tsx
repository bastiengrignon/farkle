import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Table,
  Group,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "@tolgee/react";
import { IconTrophy, IconMedal, IconCrown } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  wins: number;
  lastPlayed: string;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, player: "Alice", score: 15200, wins: 23, lastPlayed: "2 hours ago" },
  { rank: 2, player: "Bob", score: 14850, wins: 21, lastPlayed: "1 day ago" },
  { rank: 3, player: "Charlie", score: 13400, wins: 18, lastPlayed: "3 days ago" },
  { rank: 4, player: "Diana", score: 12950, wins: 15, lastPlayed: "1 week ago" },
  { rank: 5, player: "Eve", score: 11800, wins: 12, lastPlayed: "2 weeks ago" },
  { rank: 6, player: "Frank", score: 10500, wins: 10, lastPlayed: "1 month ago" },
  { rank: 7, player: "Grace", score: 9850, wins: 8, lastPlayed: "1 month ago" },
  { rank: 8, player: "Henry", score: 9200, wins: 7, lastPlayed: "2 months ago" },
  { rank: 9, player: "Ivy", score: 8750, wins: 6, lastPlayed: "2 months ago" },
  { rank: 10, player: "Jack", score: 8300, wins: 5, lastPlayed: "3 months ago" },
];

export function LeaderboardPage() {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconCrown size={20} stroke={1.5} color={theme.colors.gold[5]} />;
      case 2:
        return <IconMedal size={20} stroke={1.5} color={theme.colors.silver[5]} />;
      case 3:
        return <IconTrophy size={20} stroke={1.5} color={theme.colors.bronze[5]} />;
      default:
        return <Text size="sm">{rank}</Text>;
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return theme.colors.gold[5];
      case 2:
        return theme.colors.silver[5];
      case 3:
        return theme.colors.bronze[5];
      default:
        return "inherit";
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group align="center" justify="space-between">
          <Title order={1} size="h2">
            {t("leaderboard.title")}
          </Title>
          <Badge variant="filled" color="blue" size="lg">
            Top 10 Players
          </Badge>
        </Group>

        <Paper withBorder p="lg" radius="md">
          <DataTable
            withTableBorder
            borderRadius="md"
            columns={[
              {
                accessor: "rank",
                title: t("leaderboard.rank"),
                width: 80,
                render: (entry) => (
                  <Group gap="xs" justify="center">
                    {getMedalIcon(entry.rank)}
                  </Group>
                ),
              },
              {
                accessor: "player",
                title: t("leaderboard.player"),
                render: (entry) => (
                  <Text fw={500} c={getMedalColor(entry.rank)}>
                    {entry.player}
                  </Text>
                ),
              },
              {
                accessor: "score",
                title: t("leaderboard.score"),
                textAlignment: "right",
                render: (entry) => (
                  <Text ta="right" fw={600}>
                    {entry.score.toLocaleString()}
                  </Text>
                ),
              },
              {
                accessor: "wins",
                title: t("leaderboard.wins"),
                textAlignment: "right",
                render: (entry) => (
                  <Badge
                    variant="filled"
                    color="green"
                    radius="sm"
                    size="sm"
                  >
                    {entry.wins}
                  </Badge>
                ),
              },
              {
                accessor: "lastPlayed",
                title: "Last Played",
                textAlignment: "right",
                render: (entry) => (
                  <Text size="sm" c="dimmed" ta="right">
                    {entry.lastPlayed}
                  </Text>
                ),
              },
            ]}
            records={mockLeaderboardData}
            rowStyle={(row) => ({
              backgroundColor:
                row.rank === 1
                  ? theme.fn.rgba(theme.colors.gold[5], 0.1)
                  : row.rank === 2
                  ? theme.fn.rgba(theme.colors.silver[5], 0.1)
                  : row.rank === 3
                  ? theme.fn.rgba(theme.colors.bronze[5], 0.1)
                  : "transparent",
            })}
          />
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="sm">
            <Title order={4} size="h4">
              Statistics
            </Title>
            <Group gap="xl">
              <Stack gap="xs" align="center">
                <Text size="xs" c="dimmed">
                  Total Players
                </Text>
                <Title order={3} size="h4">
                  128
                </Title>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xs" c="dimmed">
                  Total Games
                </Text>
                <Title order={3} size="h4">
                  456
                </Title>
              </Stack>
              <Stack gap="xs" align="center">
                <Text size="xs" c="dimmed">
                  Highest Score
                </Text>
                <Title order={3} size="h4">
                  24,850
                </Title>
              </Stack>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default LeaderboardPage;
