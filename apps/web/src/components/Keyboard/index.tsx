import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbNumber6 } from 'react-icons/tb';

import { Box, Button, Flex, Space } from '@mantine/core';

import KeyboardFirstRow from '@components/Keyboard/KeyboardFirstRow';
import KeyboardSecondRow from '@components/Keyboard/KeyboardSecondRow';
import KeyboardThirdRow from '@components/Keyboard/KeyboardThirdRow';
import ScorePreview from '@components/ScorePreview';

import { useKeyboardHooks } from './Keyboard.hooks.ts';

const Keyboard: FC = () => {
  const { t } = useTranslation('game');
  const { canCurrentPlayerScore, settings, farkle, sixDiceFarkle, bank } = useKeyboardHooks();
  return (
    <Box>
      <ScorePreview />
      <Space h="sm" />
      <KeyboardFirstRow />
      <Space h="sm" />
      <KeyboardSecondRow />
      <Space h="sm" />
      <KeyboardThirdRow />
      <Space h="sm" />
      <Flex gap="sm" justify="space-between">
        {settings.sixDiceFarkle.enabled && (
          <Button color="red" onClick={sixDiceFarkle}>
            <TbNumber6 size={48} />
          </Button>
        )}
        <Button fullWidth color="red" onClick={() => farkle(t)}>
          {t('keyboard.farkle')}
        </Button>
        <Button fullWidth color="green" onClick={() => bank(t)} disabled={!canCurrentPlayerScore}>
          {t('keyboard.bank')}
        </Button>
      </Flex>
    </Box>
  );
};

export default Keyboard;
