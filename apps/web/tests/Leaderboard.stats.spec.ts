import { describe, expect, it } from 'vitest';

import type { TurnResult } from '@farkle/core';

import { getMostFarklesInARow, getMostFarklesInOneGame } from '../src/pages/Leaderboard/Leaderboard.stats';

const turn = (playerName: string, isFarkle = true): TurnResult => ({
  playerId: playerName,
  playerName,
  isFarkle,
  scoreBanked: isFarkle ? null : 500,
  timestamp: 0,
});

describe('most Farkles in one game', () => {
  it('counts repeated Farkles despite banked turns and takes the maximum across games', () => {
    expect(
      getMostFarklesInOneGame([
        {
          turnHistory: [
            turn('Alice'),
            turn('Bob'),
            turn('Alice'),
            turn('Bob', false),
            turn('Alice', false),
            turn('Alice'),
          ],
        },
        { turnHistory: [turn('Alice'), turn('Bob'), turn('Bob')] },
        { turnHistory: [turn('Alice', false)] },
      ])
    ).toEqual([
      { name: 'Alice', count: 3 },
      { name: 'Bob', count: 2 },
    ]);
  });

  it('supports player names matching object properties', () => {
    expect(getMostFarklesInOneGame([{ turnHistory: [turn('constructor'), turn('constructor')] }])).toEqual([
      { name: 'constructor', count: 2 },
    ]);
  });

  it('returns no results without Farkles', () => {
    expect(getMostFarklesInOneGame([])).toEqual([]);
    expect(getMostFarklesInOneGame([{ turnHistory: [turn('Alice', false)] }])).toEqual([]);
  });
});

describe('most Farkles in a row', () => {
  it('preserves a player’s streak when another player banks and keeps the peak after it ends', () => {
    expect(
      getMostFarklesInARow([
        {
          turnHistory: [
            turn('Alice'),
            turn('Bob', false),
            turn('Alice'),
            turn('Bob', false),
            turn('Alice'),
            turn('Alice', false),
            turn('Alice'),
          ],
        },
      ])
    ).toEqual([{ name: 'Alice', count: 3 }]);
  });

  it('resets only the player who banks and never joins streaks across games', () => {
    expect(
      getMostFarklesInARow([
        { turnHistory: [turn('Alice'), turn('Bob'), turn('Alice', false), turn('Bob'), turn('Alice')] },
        { turnHistory: [turn('Alice'), turn('Alice'), turn('Bob')] },
      ])
    ).toEqual([
      { name: 'Alice', count: 2 },
      { name: 'Bob', count: 2 },
    ]);
  });
});
