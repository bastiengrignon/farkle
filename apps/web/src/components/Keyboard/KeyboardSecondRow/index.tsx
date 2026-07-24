import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ActionIcon, Flex, Text } from '@mantine/core';

import { FARKLE_SCORES } from '@farkle/core';
import { useFarkleStore } from '@store/farkle';

const KeyboardSecondRow: FC = () => {
  const { t } = useTranslation('game');
  const addCurrentPlayerPoints = useFarkleStore((state) => state.addPointsToPlayer);

  return (
    <Flex gap="sm" justify="space-between">
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.STRAIGHT)}>
        <Text size="lg">{t('keyboard.straight')}</Text>
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.THREE_PAIR)}>
        <Text size="lg">{t('keyboard.threePair')}</Text>
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.FIVE_DICE)}>
        <Text size="lg">{t('keyboard.fiveTimes')}</Text>
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.SIX_DICE)}>
        <Text size="lg">{t('keyboard.sixTimes')}</Text>
      </ActionIcon>
    </Flex>
  );
};

export default KeyboardSecondRow;
