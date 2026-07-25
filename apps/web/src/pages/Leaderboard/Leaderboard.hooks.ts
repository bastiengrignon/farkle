import { useMemo } from 'react';

import type { PodiumWinner } from '@farkle/core';
import { sortDirections, useSortTable } from '@hooks/datatable';
import { useFarkleStore } from '@store/farkle';

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

  /*
  const gameRoundStats = useMemo(() => {
    const gameRounds = finishedGames.map((game) => ({
      gameId: game.id,
      roundCount: game.turnHistory.length,
    }));

    if (gameRounds.length === 0) {
      return { mostRounds: null, leastRounds: null };
    }

    const sortedByRounds = [...gameRounds].sort((a, b) => b.roundCount - a.roundCount);
    const mostRounds = sortedByRounds[0];
    const leastRounds = sortedByRounds[sortedByRounds.length - 1];

    return { mostRounds, leastRounds };
  }, [finishedGames]);
*/

  const mostFarklesInARow = useMemo(() => {
    const playerFarkleStreaks: Record<string, number> = {};

    finishedGames.forEach((game) => {
      let currentStreak: Record<string, number> = {};

      game.turnHistory.forEach((turn) => {
        if (turn.isFarkle) {
          currentStreak[turn.playerName] = (currentStreak[turn.playerName] || 0) + 1;
        } else {
          currentStreak = {};
        }
      });

      Object.entries(currentStreak).forEach(([playerName, streak]) => {
        if (!playerFarkleStreaks[playerName] || streak > playerFarkleStreaks[playerName]) {
          playerFarkleStreaks[playerName] = streak;
        }
      });
    });

    return Object.entries(playerFarkleStreaks)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [finishedGames]);

  const mostFarklesInOneGame = useMemo(() => {
    const playerFarklesPerGame: Record<string, number> = {};

    finishedGames.forEach((game) => {
      const gameFarkles: Record<string, number> = {};
      game.turnHistory.forEach((turn) => {
        if (turn.isFarkle) {
          gameFarkles[turn.playerName] = (gameFarkles[turn.playerName] || 0) + 1;
        }
      });

      Object.entries(gameFarkles).forEach(([playerName, count]) => {
        if (!playerFarklesPerGame[playerName] || count > playerFarklesPerGame[playerName]) {
          playerFarklesPerGame[playerName] = count;
        }
      });
    });

    return Object.entries(playerFarklesPerGame)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [finishedGames]);

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
    mostFarklesInOneGame,
    mostFarklesInARow,
    sortStatus,
    setSortStatus,
  };
};
