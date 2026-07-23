import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  Badge,
  Box,
  Modal,
  TextInput,
  List,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "@tolgee/react";
import { useDisclosure } from "@mantine/hooks";
import { useGameStore } from "../store/gameStore";
import { DiceDisplay } from "../components/DiceDisplay";
import { PlayerScores } from "../components/PlayerScores";
import { IconDice, IconCoin, IconPlayer, IconX, IconTrophy } from "@tabler/icons-react";
import classes from "./Game.module.css";

export function GamePage() {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [playerSetupOpened, { open: openPlayerSetup, close: closePlayerSetup }] = useDisclosure(false);
  const [newPlayerName, setNewPlayerName] = React.useState("");
  const [playerNames, setPlayerNames] = React.useState<string[]>(["Player 1", "Player 2"]);

  const {
    dice,
    selectedDice,
    rollsRemaining,
    currentPlayer,
    currentTurnScore,
    currentTotalScore,
    canBank,
    canRollDice,
    isGameFinished,
    winner,
    playersSortedByScore,
    rollDice: handleRollDice,
    selectDie: handleSelectDie,
    bankScore: handleBankScore,
    endTurn: handleEndTurn,
    resetGame: handleResetGame,
    setPlayers: handleSetPlayers,
  } = useGameStore();

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayerNames([...playerNames, newPlayerName.trim()]);
      setNewPlayerName("");
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      const newPlayers = [...playerNames];
      newPlayers.splice(index, 1);
      setPlayerNames(newPlayers);
    }
  };

  const handleStartGame = () => {
    handleSetPlayers(playerNames);
    closePlayerSetup();
  };

  // Check if game needs to be initialized
  React.useEffect(() => {
    // If there are no players or players are default, show setup modal
    const hasDefaultPlayers = currentPlayer().playerId === "Player 1" || currentPlayer().playerId === "Player 2";
    if (hasDefaultPlayers && playerNames.length === 2) {
      openPlayerSetup();
    }
  }, []);

  if (isGameFinished()) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="xl">
          <Title order={1} size="h1" ta="center">
            {t("game.game_over")}
          </Title>
          
          <ThemeIcon
            size="xl"
            radius="md"
            variant="filled"
            color="gold"
          >
            <IconTrophy size={60} stroke={1.5} />
          </ThemeIcon>

          <Title order={2} size="h2" ta="center">
            {t("game.winner", { player: winner() })}
          </Title>

          <Text size="xl" c="dimmed" ta="center">
            {t("game.score", { score: currentTotalScore() })}
          </Text>

          <Button
            onClick={handleResetGame}
            size="lg"
            variant="filled"
            leftSection={<IconDice size={20} stroke={1.5} />}
          >
            {t("game.new_game")}
          </Button>

          <PlayerScores players={playersSortedByScore()} />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Player Info */}
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                {t("game.current_player")}
              </Text>
              <Group gap="sm" align="center">
                <IconPlayer size={24} stroke={1.5} color={theme.colors.indigo[5]} />
                <Title order={3} size="h4">
                  {currentPlayer().playerId}
                </Title>
              </Group>
            </Stack>
            
            <Group gap="md">
              <Badge
                variant="filled"
                color="blue"
                size="lg"
                radius="md"
              >
                <Group gap="xs" align="center">
                  <IconCoin size={16} stroke={1.5} />
                  <Text size="sm" fw={600}>
                    {t("game.score", { score: currentTotalScore() })}
                  </Text>
                </Group>
              </Badge>
              
              <Badge
                variant="filled"
                color="grape"
                size="lg"
                radius="md"
              >
                <Group gap="xs" align="center">
                  <IconDice size={16} stroke={1.5} />
                  <Text size="sm" fw={600}>
                    {t("game.turn_score", { score: currentTurnScore() })}
                  </Text>
                </Group>
              </Badge>

              <Badge
                variant="filled"
                color="teal"
                size="lg"
                radius="md"
              >
                <Group gap="xs" align="center">
                  <Text size="sm" fw={600}>
                    {t("game.rolls_remaining", { count: rollsRemaining })}
                  </Text>
                </Group>
              </Badge>
            </Group>
          </Group>
        </Paper>

        {/* Dice Display */}
        <Box className={classes.diceContainer}>
          <DiceDisplay
            dice={dice}
            selectedDice={selectedDice}
            onSelectDie={handleSelectDie}
          />
        </Box>

        {/* Action Buttons */}
        <Group justify="center" gap="md">
          <Button
            onClick={handleRollDice}
            disabled={!canRollDice()}
            size="lg"
            variant="filled"
            leftSection={<IconDice size={20} stroke={1.5} />}
            className={classes.actionButton}
          >
            {t("game.roll")}
          </Button>

          <Button
            onClick={handleBankScore}
            disabled={!canBank()}
            size="lg"
            variant="filled"
            color="green"
            leftSection={<IconCoin size={20} stroke={1.5} />}
            className={classes.actionButton}
          >
            {t("game.bank")}
          </Button>

          <Button
            onClick={handleEndTurn}
            size="lg"
            variant="outline"
            color="red"
            leftSection={<IconX size={20} stroke={1.5} />}
            className={classes.actionButton}
          >
            {t("game.end_turn")}
          </Button>
        </Group>

        {/* Player Scores */}
        <PlayerScores players={playersSortedByScore()} />

        {/* Reset Game Button */}
        <Group justify="center">
          <Button
            onClick={() => {
              handleResetGame();
              openPlayerSetup();
            }}
            variant="subtle"
            color="gray"
            size="sm"
          >
            {t("game.new_game")}
          </Button>
        </Group>
      </Stack>

      {/* Player Setup Modal */}
      <Modal
        opened={playerSetupOpened}
        onClose={closePlayerSetup}
        title={t("common.players")}
        centered
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {t("common.start_game")}
          </Text>

          <List spacing="sm">
            {playerNames.map((player, index) => (
              <List.Item
                key={index}
                icon={
                  <ThemeIcon
                    color="blue"
                    size={24}
                    radius="sm"
                  >
                    <IconPlayer size={16} stroke={1.5} />
                  </ThemeIcon>
                }
              >
                <Group justify="space-between" align="center">
                  <Text>{player}</Text>
                  {playerNames.length > 2 && (
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => handleRemovePlayer(index)}
                      leftSection={<IconX size={14} stroke={1.5} />}
                    >
                      {t("common.remove_player")}
                    </Button>
                  )}
                </Group>
              </List.Item>
            ))}
          </List>

          <Group gap="sm">
            <TextInput
              placeholder={t("common.add_player")}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.currentTarget.value)}
              flex={1}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddPlayer();
                }
              }}
            />
            <Button
              onClick={handleAddPlayer}
              variant="filled"
            >
              {t("common.add_player")}
            </Button>
          </Group>

          <Group justify="flex-end">
            <Button
              onClick={closePlayerSetup}
              variant="subtle"
            >
              {t("common.back")}
            </Button>
            <Button
              onClick={handleStartGame}
              variant="filled"
              disabled={playerNames.length < 2}
            >
              {t("common.start_game")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default GamePage;
