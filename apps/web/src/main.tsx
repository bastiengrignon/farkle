/** biome-ignore-all lint/style/noNonNullAssertion: Root is always defined */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import i18n from './i18n/config';
import { router } from './router';
import { theme } from './theme';
import { registerSW } from 'virtual:pwa-register';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

import 'mantine-datatable/styles.css';
import './styles/global.css';

const updateSW = registerSW({
  onNeedRefresh: () => {
    if (confirm(i18n.t('common:newVersion'))) {
      updateSW(true);
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
