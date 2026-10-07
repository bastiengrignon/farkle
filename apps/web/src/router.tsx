import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

import ErrorBoundary from '@pages/ErrorBoundary';
import GamePage from '@pages/GamePage';
import GamePageEnd from '@pages/GamePageEnd';
import HomePage from '@pages/HomePage';
import Layout from '@pages/Layout';

const Leaderboard = lazy(() => import('@pages/Leaderboard'));
const Rules = lazy(() => import('@pages/Rules'));
const Settings = lazy(() => import('@pages/Settings'));

type Routes = {
  home: string;
  settings: string;
  game: {
    id: string;
    end: string;
  };
  history: string;
  rules: string;
};

export const routes: Routes = {
  home: '/',
  settings: '/settings',
  game: {
    id: '/g/:gameId',
    end: '/g/:gameId/end',
  },
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
        element: <HomePage />,
      },
      {
        path: routes.settings,
        element: <Settings />,
      },
      {
        path: routes.game.id,
        element: <GamePage />,
      },
      {
        path: routes.game.end,
        element: <GamePageEnd />,
      },
      {
        path: routes.history,
        element: <Leaderboard />,
      },
      {
        path: routes.rules,
        element: <Rules />,
      },
    ],
  },
]);
