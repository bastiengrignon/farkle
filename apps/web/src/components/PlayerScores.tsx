import { Paper, Table, Text, useMantineTheme } from "@mantine/core";
import type { PlayerScore } from "@farkle/core";
import classes from "./PlayerScores.module.css";

interface PlayerScoresProps {
  players: PlayerScore[];
}

export function PlayerScores({ players }: PlayerScoresProps) {
  const theme = useMantineTheme();

  const rows = players.map((player, index) => (
    <Table.Tr
      key={player.playerId}
      className={player.isActive ? classes.activePlayer : ""}
    >
      <Table.Td>
        <Text fw={600} c={player.isActive ? theme.colors.blue[5] : "inherit"}>
          {index + 1}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw={500}>
          {player.playerId}
        </Text>
        {player.isActive && (
          <Text size="xs" c="blue" span>
            {" (Current)"}
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <Text ta="right">
          {player.score.toLocaleString()}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text ta="right" c="dimmed">
          {player.turnScore > 0 ? `+${player.turnScore}` : "-"}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Text size="sm" c="dimmed" mb="sm">
        Leaderboard
      </Text>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Player</Table.Th>
            <Table.Th ta="right">Total Score</Table.Th>
            <Table.Th ta="right">Turn Score</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Paper>
  );
}

export default PlayerScores;
