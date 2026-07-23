import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "@tolgee/react";
import { Link } from "react-router-dom";
import { IconDice, IconTrophy, IconSettings, IconHelp } from "@tabler/icons-react";
import classes from "./Home.module.css";

export function HomePage() {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const features = [
    {
      title: t("home.play_now"),
      description: t("home.subtitle"),
      icon: IconDice,
      to: "/game",
      color: "blue",
    },
    {
      title: t("home.leaderboard"),
      description: "See top players and their scores",
      icon: IconTrophy,
      to: "/leaderboard",
      color: "grape",
    },
    {
      title: t("home.settings"),
      description: "Customize your game experience",
      icon: IconSettings,
      to: "/settings",
      color: "teal",
    },
    {
      title: t("home.rules"),
      description: "Learn how to play Farkle",
      icon: IconHelp,
      to: "/rules",
      color: "orange",
    },
  ];

  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="xl">
        <Title
          order={1}
          size="h1"
          weight={800}
          ta="center"
          className={classes.title}
        >
          {t("home.title")}
        </Title>

        <Text
          size="xl"
          c="dimmed"
          ta="center"
          maw={600}
        >
          {t("home.subtitle")}
        </Text>

        <Button
          component={Link}
          to="/game"
          size="xl"
          radius="md"
          variant="filled"
          className={classes.playButton}
        >
          {t("home.play_now")}
        </Button>

        <Group gap="md" justify="center">
          {features.map((feature) => (
            <Paper
              key={feature.title}
              component={Link}
              to={feature.to}
              radius="md"
              p="lg"
              shadow="sm"
              withHover
              className={classes.featureCard}
              style={{
                borderTop: `4px solid ${theme.colors[feature.color][5]}`,
              }}
            >
              <Stack align="center" gap="sm">
                <feature.icon
                  size={40}
                  stroke={1.5}
                  color={theme.colors[feature.color][5]}
                />
                <Title order={4} size="h4" ta="center">
                  {feature.title}
                </Title>
                <Text size="sm" c="dimmed" ta="center">
                  {feature.description}
                </Text>
              </Stack>
            </Paper>
          ))}
        </Group>
      </Stack>
    </Container>
  );
}

export default HomePage;
