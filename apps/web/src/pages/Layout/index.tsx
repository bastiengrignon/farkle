import { type FC, Suspense, useMemo } from 'react';
import { Outlet, useNavigation } from 'react-router';

import { AppShell, LoadingOverlay, useComputedColorScheme } from '@mantine/core';

import { usePWABanner } from '@hooks/PWABanner';
import Header from '@pages/Layout/Header';

const Layout: FC = () => {
  usePWABanner();
  const colorScheme = useComputedColorScheme();
  const navigation = useNavigation();

  const isLoading = useMemo(() => navigation.state === 'loading', [navigation.state]);

  return (
    <AppShell 
      header={{ height: 60 }}
      style={{ paddingTop: `calc(env(safe-area-inset-top) + var(--mantine-spacing-md))` }}
      padding="xs" 
      bg={colorScheme === 'dark' ? 'dark.5' : 'gray.2'}
      >
      <AppShell.Header bg="blue.5" p="xs">
        <Header />
      </AppShell.Header>
      <AppShell.Main pos="relative">
        <Suspense fallback={<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ blur: 3 }} />}>
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
