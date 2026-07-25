import type { FC } from 'react';
import { TbMoon, TbSun } from 'react-icons/tb';

import { ActionIcon, ThemeIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

import { UMAMI_EVENTS } from '@constants/umami';

const ColorSwitcher: FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      data-umami-event={UMAMI_EVENTS.TOGGLE_THEME}
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
    >
      <ThemeIcon darkHidden>
        <TbSun />
      </ThemeIcon>
      <ThemeIcon lightHidden>
        <TbMoon />
      </ThemeIcon>
    </ActionIcon>
  );
};

export default ColorSwitcher;
