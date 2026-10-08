import type { FinishedGame } from '@farkle/core';

const sortCounts = (counts: Map<string, number>) =>
  Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

export const getMostFarklesInOneGame = (games: Pick<FinishedGame, 'turnHistory'>[]) => {
  const maximumCounts = new Map<string, number>();

  for (const game of games) {
    const gameCounts = new Map<string, number>();
    for (const turn of game.turnHistory) {
      if (turn.isFarkle) {
        gameCounts.set(turn.playerName, (gameCounts.get(turn.playerName) ?? 0) + 1);
      }
    }
    for (const [name, count] of gameCounts) {
      maximumCounts.set(name, Math.max(maximumCounts.get(name) ?? 0, count));
    }
  }

  return sortCounts(maximumCounts);
};

export const getMostFarklesInARow = (games: Pick<FinishedGame, 'turnHistory'>[]) => {
  const maximumStreaks = new Map<string, number>();

  for (const game of games) {
    const currentStreaks = new Map<string, number>();
    for (const turn of game.turnHistory) {
      if (!turn.isFarkle) {
        currentStreaks.delete(turn.playerId);
        continue;
      }
      const streak = (currentStreaks.get(turn.playerId) ?? 0) + 1;
      currentStreaks.set(turn.playerId, streak);
      maximumStreaks.set(turn.playerName, Math.max(maximumStreaks.get(turn.playerName) ?? 0, streak));
    }
  }

  return sortCounts(maximumStreaks);
};
