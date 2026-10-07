import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Center, Flex, NumberFormatter, Paper, Stack, Text, Title } from '@mantine/core';

import { useGamePageEndHooks } from './GamePageEnd.ts';

const GamePageEnd: FC = () => {
  const { t } = useTranslation('game');
  const { winners, handleLeaveGame } = useGamePageEndHooks();

  return (
    <Center p="md" mih="calc(100dvh - calc(var(--app-shell-header-offset, 0rem) * 2))">
      <Stack w="100%" maw={500}>
        <Title order={2} ta="center">
          {t('finished.winner', { count: winners.length })}
        </Title>
        {winners.map((winner) => (
          <Paper key={winner.id} withBorder p="md">
            <Flex justify="space-between" align="center">
              <Text fw="bold">{winner.name}</Text>
              <NumberFormatter value={winner.score} thousandSeparator=" " />
            </Flex>
          </Paper>
        ))}
        <Button fullWidth mt="md" onClick={handleLeaveGame}>
          {t('newGame.title')}
        </Button>
      </Stack>
    </Center>
  );
};

export default GamePageEnd;
