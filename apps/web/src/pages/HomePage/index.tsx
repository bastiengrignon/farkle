import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TbDice1, TbHelp, TbSettings, TbTrophy } from 'react-icons/tb';
import { Link } from 'react-router';

import { Container, Group, Paper, Stack, Text, useMantineTheme } from '@mantine/core';

import ModalNewGame from '@components/ModalNewGame';

import { routes } from '../../router';
import { useHomePageHooks } from './HomePage.hooks.ts';

export const HomePage = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { openedNewGameModal, openNewGameModal, closeNewGameModal } = useHomePageHooks();
  const features = useMemo(
    () => [
      {
        title: t('home.newGame'),
        // description: t('home.subtitle'),
        icon: TbDice1,
        to: '',
        onClick: openNewGameModal,
        color: 'blue',
      },
      {
        title: t('home.leaderboard'),
        // description: 'See top players and their scores',
        icon: TbTrophy,
        to: routes.history,
        color: 'yellow',
      },
      {
        title: t('home.settings'),
        // description: 'Customize your game experience',
        icon: TbSettings,
        to: routes.settings,
        color: 'teal',
      },
      {
        title: t('home.rules'),
        // description: 'Learn how to play Farkle',
        icon: TbHelp,
        to: routes.rules,
        color: 'grape',
      },
    ],
    [t, openNewGameModal]
  );

  return (
    <Container size="md" py="xl">
      <Group gap="md" justify="center">
        {features.map((feature) => (
          <Paper
            key={feature.title}
            component={Link}
            to={feature.to}
            onClick={() => feature?.onClick?.()}
            radius="md"
            p="lg"
            shadow="sm"
            w={200}
            style={{
              borderTop: `4px solid ${theme.colors[feature.color][5]}`,
            }}
          >
            <Stack align="center" gap="sm">
              <feature.icon size={40} color={theme.colors[feature.color][5]} />
              <Text size="xl" c={feature.color} ta="center" fw="bold">
                {feature.title}
              </Text>
            </Stack>
          </Paper>
        ))}
      </Group>
      <ModalNewGame opened={openedNewGameModal} close={closeNewGameModal} />
    </Container>
  );
};

export default HomePage;
