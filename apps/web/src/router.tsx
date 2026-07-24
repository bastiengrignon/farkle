import { createBrowserRouter } from 'react-router';

import ErrorBoundary from '@pages/ErrorBoundary';
import Homepage from '@pages/Homepage';
import Layout from '@pages/Layout';

type Routes = {
  home: string;
  settings: string;
  game: string;
  history: string;
  rules: string;
};

export const routes: Routes = {
  home: '/',
  settings: '/settings',
  game: '/farkle/:gameId',
  history: '/history',
  rules: '/rules',
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: routes.home,
        element: <Homepage />,
      },
      {
        path: routes.settings,
        // element: <FarkleSettingsPage />,
        element: <div>Settings</div>,
      },
      {
        path: routes.game,
        // element: <FarkleGamePage />,
        element: <div>game page</div>,
      },
      {
        path: routes.history,
        // element: <GameHistoryPage />,
        element: <div>history</div>,
      },
    ],
  },
]);
