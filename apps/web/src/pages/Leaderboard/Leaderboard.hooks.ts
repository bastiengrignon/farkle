import { useMemo } from 'react';

import type { PodiumWinner } from '@farkle/core';
import { sortDirections, useSortTable } from '@hooks/datatable';
import { useFarkleStore } from '@store/farkle';

import { getMostFarklesInARow, getMostFarklesInOneGame } from './Leaderboard.stats';

export const useLeaderboardHooks = () => {
  const finishedGames = useFarkleStore((state) => state.finishedGames);

  const topWinners = useMemo(() => {
    const top3Winners = Object.entries(
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
      .slice(0, 3)
      .sort((a, b) => b.wins - a.wins);
    return [1, 0, 2]
      .reduce<PodiumWinner[]>((podiumOrder, position) => [...podiumOrder, top3Winners[position]], [])
      .filter(Boolean);
  }, [finishedGames]);

  const mostFarklers = useMemo(
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
        .sort((a, b) => b.count - a.count),
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
    sortedFinishedGames,
    topWinners,
    mostFarklers,
    mostFarklesInOneGame: getMostFarklesInOneGame(finishedGames),
    mostFarklesInARow: getMostFarklesInARow(finishedGames),
    sortStatus,
    setSortStatus,
  };
};
