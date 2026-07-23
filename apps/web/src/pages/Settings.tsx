import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Select,
  Group,
  Button,
  Divider,
} from "@mantine/core";
import { useTranslation } from "@tolgee/react";
import { useLocalStorage } from "@mantine/hooks";
import { IconLanguage, IconPalette, IconCheck } from "@tabler/icons-react";

export function SettingsPage() {
  const { t } = useTranslation();
  const [language, setLanguage] = useLocalStorage<string>({
    key: "farkle-language",
    defaultValue: "en",
  });
  const [colorScheme, setColorScheme] = useLocalStorage<string>({
    key: "farkle-color-scheme",
    defaultValue: "dark",
  });

  const languages = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "es", label: "Español" },
  ];

  const themes = [
    { value: "light", label: t("settings.light") },
    { value: "dark", label: t("settings.dark") },
    { value: "system", label: t("settings.system") },
  ];

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      setLanguage(value);
      // In a real app, you would also change the Tolgee language
      // tolgee.changeLanguage(value);
    }
  };

  const handleThemeChange = (value: string | null) => {
    if (value) {
      setColorScheme(value);
      // In a real app, you would also change the Mantine color scheme
      // This would require using the useMantineColorScheme hook
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={1} size="h2" ta="center">
          {t("settings.title")}
        </Title>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group align="center" gap="sm">
              <IconLanguage size={24} stroke={1.5} />
              <Title order={4} size="h4">
                {t("settings.language")}
              </Title>
            </Group>

            <Select
              data={languages}
              value={language}
              onChange={handleLanguageChange}
              placeholder={t("settings.language")}
              clearable={false}
            />
          </Stack>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Group align="center" gap="sm">
              <IconPalette size={24} stroke={1.5} />
              <Title order={4} size="h4">
                {t("settings.theme")}
              </Title>
            </Group>

            <Select
              data={themes}
              value={colorScheme}
              onChange={handleThemeChange}
              placeholder={t("settings.theme")}
              clearable={false}
            />
          </Stack>
        </Paper>

        <Group justify="center">
          <Button
            variant="filled"
            size="md"
            leftSection={<IconCheck size={20} stroke={1.5} />}
          >
            {t("settings.save")}
          </Button>
        </Group>

        <Divider />

        <Paper withBorder p="lg" radius="md">
          <Stack gap="sm">
            <Title order={5} size="h5">
              About
            </Title>
            <Text size="sm" c="dimmed">
              Farkle Game v1.0.0
            </Text>
            <Text size="sm" c="dimmed">
              Built with React, Mantine, and TypeScript
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default SettingsPage;
