import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ActionIcon, Flex, Text } from '@mantine/core';

import { FARKLE_SCORES } from '@farkle/core';
import { useFarkleStore } from '@store/farkle';

const KeyboardThirdRow: FC = () => {
  const { t } = useTranslation('game');
  const addCurrentPlayerPoints = useFarkleStore((state) => state.addPointsToPlayer);

  return (
    <Flex gap="sm" justify="space-between">
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.FOUR_DICE_ONE_PAIR)}>
        <Text size="lg">{t('keyboard.fourTimesOnePair')}</Text>
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.TWO_TRIPLETS)}>
        <Text size="lg">{t('keyboard.twoTriplets')}</Text>
      </ActionIcon>
    </Flex>
  );
};

export default KeyboardThirdRow;
