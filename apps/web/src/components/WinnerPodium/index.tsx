import type { FC } from 'react';
import { TbCrown, TbMedal, TbTrophy } from 'react-icons/tb';

import type { TFunction } from 'i18next';

import { Box, Flex, Paper, Stack, Text, ThemeIcon, useComputedColorScheme } from '@mantine/core';

import type { PodiumWinner } from '@farkle/core';

import classes from './WinnerPodium.module.css';

interface WinnerPodiumProps {
  winners: PodiumWinner[];
  t: TFunction;
}

const podiumHeight = [250 * 0.75, 250, 250 * 0.5];
const colors = [
  { bg: 'var(--mantine-color-gray-6)', text: 'var(--mantine-color-gray-9)', icon: <TbTrophy size={32} /> },
  { bg: 'var(--mantine-color-yellow-6)', text: 'var(--mantine-color-yellow-9)', icon: <TbCrown size={32} /> },
  { bg: 'var(--mantine-color-orange-6)', text: 'var(--mantine-color-orange-9)', icon: <TbMedal size={32} /> },
];

const WinnerPodium: FC<WinnerPodiumProps> = ({ winners, t }) => {
  const scheme = useComputedColorScheme();

  return (
    <Flex justify="center" align="flex-end" gap={{ base: 'xs', md: 'md' }}>
      {winners.map((winner, index) => (
        <Stack gap="xs" key={winner.name}>
          <Text
            fw="bold"
            c={scheme === 'dark' && index === 0 ? 'var(--mantine-color-text)' : colors[index].text}
            ta="center"
          >
            {winner.name}
          </Text>
          <Paper
            w={{ base: 100, sm: 120 }}
            className={classes.podiumStep}
            style={{
              height: podiumHeight[index],
              backgroundColor: colors[index].bg,
            }}
          >
            <ThemeIcon size="xl" variant="transparent" color={colors[index].text}>
              {colors[index].icon}
            </ThemeIcon>
            <Box className={classes.podiumStepWins}>
              <Text fw="bold" c={colors[index].text} size="xs" ta="center">
                {t('leaderboard.wins', { wins: winner.wins })}
              </Text>
            </Box>
          </Paper>
        </Stack>
      ))}
    </Flex>
  );
};

export default WinnerPodium;
