import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const useCustomMediaQuery = (breakpoint = 'sm') => {
  const theme = useMantineTheme();
  return useMediaQuery(`(max-width: ${theme.breakpoints[breakpoint]})`);
};
