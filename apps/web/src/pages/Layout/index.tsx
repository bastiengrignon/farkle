import type { FC } from 'react';
import { Outlet } from 'react-router';

import { AppShell, useComputedColorScheme } from '@mantine/core';

import { usePWABanner } from '@hooks/PWABanner';
import Header from '@pages/Layout/Header';

const Layout: FC = () => {
  const colorScheme = useComputedColorScheme();
  usePWABanner();
  return (
    <AppShell header={{ height: 60 }} padding="xs" bg={colorScheme === 'dark' ? 'dark.5' : 'gray.2'}>
      <AppShell.Header bg="blue.5" p="xs">
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
