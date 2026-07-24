import { useMemo } from 'react';

import { sortDirections, useSortTable } from '@hooks/datatable';
import { useFarkleStore } from '@store/farkle';

export const useLeaderboardHooks = () => {
  const finishedGames = useFarkleStore((state) => state.finishedGames);

  const topWinners = useMemo(
    () =>
      Object.entries(
        finishedGames
          .flatMap((game) => game.winnerNames)
          .reduce<Record<string, number>>(
            (acc, winner) => ({
              ...acc,
              [winner]: (acc[winner] || 0) + 1,
            }),
            {}
          )
      )
        .map(([name, wins]) => ({ name, wins }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 3),
    [finishedGames]
  );

  const topFarklers = useMemo(
    () =>
      Object.entries(
        finishedGames
          .flatMap((game) => game.turnHistory)
          .filter((turn) => turn.isFarkle)
          .reduce<Record<string, number>>(
            (acc, turn) => ({
              ...acc,
              [turn.playerName]: (acc[turn.playerName] || 0) + 1,
            }),
            {}
          )
      )
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    [finishedGames]
  );

  const {
    sortedRecords: sortedFinishedGames,
    sortStatus,
    setSortStatus,
  } = useSortTable({
    records: finishedGames,
    columnAccessor: 'timestamp',
    direction: sortDirections.asc,
  });

  return {
    finishedGames,
    sortedFinishedGames,
    topWinners,
    topFarklers,
    sortStatus,
    setSortStatus,
  };
};
