import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbAlertTriangle, TbLetterC } from 'react-icons/tb';

import clsx from 'clsx';

import { ActionIcon, Center, Flex, Group, NumberFormatter, Paper, Stack, Text, Tooltip } from '@mantine/core';

import { useScorePreviewHooks } from './ScorePreview.hooks.ts';
import classes from './ScorePreview.module.css';

const displayPreviewScoreIfAboveLimit = (previewScore: number, scoreToReach: number) =>
  previewScore > scoreToReach ? 'red' : 'inherit';

const ScorePreview: FC = () => {
  const { t } = useTranslation('game');
  const { game, settings, previewScore, currentPlayer, isBelowMinimumFirstScore, clearPreviewScore } =
    useScorePreviewHooks();

  return (
    <Center>
      <Stack gap="xs" align="center">
        {isBelowMinimumFirstScore && (
          <Tooltip withArrow label={t('bank.error.message', { minimum: settings.minimumFirstScore.score })}>
            <Group gap="xs">
              <Text size="xs" c="orange">
                <TbAlertTriangle size={12} className={classes.alertIcon} />
                {t('bank.error.title')}
              </Text>
            </Group>
          </Tooltip>
        )}
        <Text
          size="xs"
          c={
            game?.exactScoreRequired
              ? displayPreviewScoreIfAboveLimit(previewScore, game?.scoreToReach || 0)
              : 'inherit'
          }
        >
          {t('keyboard.computedPreviewScore', {
            score: previewScore,
          })}
        </Text>
        <Flex>
          <Paper
            withBorder
            className={clsx(classes.previewScoreContainer, {
              [classes.previewScoreContainerBelowMinimum]: isBelowMinimumFirstScore,
            })}
          >
            <Center>
              <NumberFormatter thousandSeparator=" " value={currentPlayer?.previewScore || 0} />
            </Center>
          </Paper>
          <Flex align="center" pos="relative">
            <ActionIcon pos="absolute" size="xl" ml="md" variant="outline" onClick={clearPreviewScore}>
              <TbLetterC />
            </ActionIcon>
          </Flex>
        </Flex>
      </Stack>
    </Center>
  );
};

export default ScorePreview;
