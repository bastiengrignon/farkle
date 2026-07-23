import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  List,
  ThemeIcon,
  Group,
  Divider,
} from "@mantine/core";
import { useTranslation } from "@tolgee/react";
import {
  IconDice,
  IconCoin,
  IconTarget,
  IconTrophy,
  IconStar,
  IconNumbers,
} from "@tabler/icons-react";

export function RulesPage() {
  const { t } = useTranslation();

  const rules = [
    {
      icon: IconTarget,
      title: t("rules.objective"),
      description: t("rules.objective_desc"),
      color: "blue",
    },
    {
      icon: IconDice,
      title: "Gameplay",
      description:
        "On your turn, roll the dice and select scoring combinations. You can roll up to 3 times per turn.",
      color: "teal",
    },
    {
      icon: IconCoin,
      title: t("rules.scoring"),
      description: "Select dice that form scoring combinations to bank points.",
      color: "green",
    },
    {
      icon: IconStar,
      title: "Special Rules",
      description:
        "You must score at least 300 points on your first turn to get on the board.",
      color: "grape",
    },
  ];

  const scoringTable = [
    { combination: "Single 1", points: "100" },
    { combination: "Single 5", points: "50" },
    { combination: "Three 1s", points: "1000" },
    { combination: "Three 2s", points: "200" },
    { combination: "Three 3s", points: "300" },
    { combination: "Three 4s", points: "400" },
    { combination: "Three 5s", points: "500" },
    { combination: "Three 6s", points: "600" },
    { combination: "Four of a kind", points: "2x Three of a kind" },
    { combination: "Five of a kind", points: "3x Three of a kind" },
    { combination: "Six of a kind", points: "4x Three of a kind" },
    { combination: "Straight (1-5)", points: "1500" },
    { combination: "Straight (2-6)", points: "2000" },
    { combination: "Full House", points: "1500" },
    { combination: "Four of a kind + Pair", points: "1500" },
    { combination: "Two Triplets", points: "2500" },
  ];

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group align="center" gap="sm">
          <ThemeIcon color="indigo" size="xl" radius="md">
            <IconDice size={32} stroke={1.5} />
          </ThemeIcon>
          <Title order={1} size="h2">
            {t("rules.title")}
          </Title>
        </Group>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Title order={3} size="h4">
              {t("rules.objective")}
            </Title>
            <Text>{t("rules.objective_desc")}</Text>
          </Stack>
        </Paper>

        <Title order={2} size="h3">
          Game Rules
        </Title>

        <Stack gap="sm">
          {rules.map((rule, index) => (
            <Paper
              key={index}
              withBorder
              p="md"
              radius="md"
              shadow="sm"
            >
              <Group gap="md" align="flex-start">
                <ThemeIcon color={rule.color} size="lg" radius="md">
                  <rule.icon size={24} stroke={1.5} />
                </ThemeIcon>
                <Stack gap="xs">
                  <Title order={5} size="h5">
                    {rule.title}
                  </Title>
                  <Text size="sm">{rule.description}</Text>
                </Stack>
              </Group>
            </Paper>
          ))}
        </Stack>

        <Divider />

        <Title order={2} size="h3">
          {t("rules.scoring")}
        </Title>

        <Paper withBorder p="lg" radius="md">
          <List spacing="sm">
            {scoringTable.map((item, index) => (
              <List.Item
                key={index}
                icon={
                  <ThemeIcon color="indigo" size={24} radius="sm">
                    <IconNumbers size={16} stroke={1.5} />
                  </ThemeIcon>
                }
              >
                <Group justify="space-between" align="center">
                  <Text fw={500}>{item.combination}</Text>
                  <Text fw={600} c="indigo">
                    {item.points}
                  </Text>
                </Group>
              </List.Item>
            ))}
          </List>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="sm">
            <Title order={4} size="h4">
              Tips
            </Title>
            <List spacing="sm" type="ordered">
              <List.Item>
                <Text size="sm">
                  Always try to bank at least 300-500 points per turn
                </Text>
              </List.Item>
              <List.Item>
                <Text size="sm">
                  Don't be greedy - sometimes it's better to bank and keep your
                  points
                </Text>
              </List.Item>
              <List.Item>
                <Text size="sm">
                  Look for high-scoring combinations like straights and three of
                  a kind
                </Text>
              </List.Item>
              <List.Item>
                <Text size="sm">
                  Keep track of your opponents' scores to plan your strategy
                </Text>
              </List.Item>
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default RulesPage;
