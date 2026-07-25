import { describe, expect, it } from 'vitest';
import type { Game, GamePlayer } from '../types';
import { advanceTurn, FARKLE_SCORES, getNextPlayerId, hasReachedWinningScore } from './farkle';

const STUB_PLAYERS: GamePlayer[] = [
  {
    id: '2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9',
    name: 'Player 1',
    score: 0,
    hasScored: false,
    previewScore: 0,
    consecutiveFarkles: 0,
  },
  {
    id: '5a437a78-b668-442d-a693-7ad70687bb1f',
    name: 'Player 2',
    score: 1350,
    hasScored: true,
    previewScore: 0,
    consecutiveFarkles: 0,
  },
];

const STUB_GAME: Game = {
  id: '1',
  players: STUB_PLAYERS,
  scoreToReach: 10_000,
  exactScoreRequired: true,
  currentPlayerIdTurn: '2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9',
};

const STUB_GAME_LAST_ROUND: Game = {
  id: '1',
  players: STUB_PLAYERS,
  scoreToReach: 10_000,
  exactScoreRequired: true,
  currentPlayerIdTurn: '2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9',
  finalRoundStartedByPlayerId: '2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9',
};

const STUB_GAME_LAST_ROUND_FINISHED: Game = {
  id: '1',
  players: STUB_PLAYERS,
  scoreToReach: 10_000,
  exactScoreRequired: true,
  currentPlayerIdTurn: '5a437a78-b668-442d-a693-7ad70687bb1f',
  finalRoundStartedByPlayerId: '2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9',
};

const STUB_GAME_NO_PLAYERS: Game = {
  id: '2',
  players: [],
  scoreToReach: 10_000,
  exactScoreRequired: true,
  currentPlayerIdTurn: '2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9',
};

describe('farkle tests', () => {
  describe('hasReachedWinningScore', () => {
    it('should be false when player as not reach the score', () => {
      expect(hasReachedWinningScore({ exactScoreRequired: true, scoreToReach: 10_000 }, 5000)).toBeFalsy();
    });

    it('should be true when player as reach the score and exact score is enabled', () => {
      expect(hasReachedWinningScore({ exactScoreRequired: true, scoreToReach: 10_000 }, 10_000)).toBeTruthy();
    });

    it('should be false when player is over the score and exact score is enabled', () => {
      expect(hasReachedWinningScore({ exactScoreRequired: true, scoreToReach: 10_000 }, 12_000)).toBeFalsy();
    });

    it('should be false when player as not reach the score and exact score is disabled', () => {
      expect(hasReachedWinningScore({ exactScoreRequired: false, scoreToReach: 10_000 }, 5000)).toBeFalsy();
    });

    it('should be true when player as reach the score and exact score is disabled', () => {
      expect(hasReachedWinningScore({ exactScoreRequired: false, scoreToReach: 10_000 }, 12_000)).toBeTruthy();
    });
  });

  describe('getNextPlayerId', () => {
    it('should return currentPlayerIdTurn if no players', () => {
      const nextPlayer = getNextPlayerId(STUB_GAME_NO_PLAYERS);
      expect(nextPlayer).toBe('2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9');
    });

    it('should return the playerId after the currentPlayerIdTurn', () => {
      const nextPlayer = getNextPlayerId(STUB_GAME);
      expect(nextPlayer).toBe('5a437a78-b668-442d-a693-7ad70687bb1f');
    });

    it('should return the first playerId when last player of the array', () => {
      const nextPlayer = getNextPlayerId({ ...STUB_GAME, currentPlayerIdTurn: '5a437a78-b668-442d-a693-7ad70687bb1f' });
      expect(nextPlayer).toBe('2c2505df-9f1d-4d81-bf90-c03bbc8c6dd9');
    });
  });

  describe('advanceTurn', () => {
    it('should move to next player, game is not finished', () => {
      const newGameState = advanceTurn(STUB_GAME);
      expect(newGameState).toStrictEqual({
        currentPlayerIdTurn: '5a437a78-b668-442d-a693-7ad70687bb1f',
        isFinished: false,
      });
    });

    it('should move to next player, game is not finished but last round', () => {
      const newGameState = advanceTurn(STUB_GAME_LAST_ROUND);
      expect(newGameState).toStrictEqual({
        currentPlayerIdTurn: '5a437a78-b668-442d-a693-7ad70687bb1f',
        isFinished: false,
      });
    });

    it('should set currentPlayer to null, game is finished', () => {
      const newGameState = advanceTurn(STUB_GAME_LAST_ROUND_FINISHED);
      expect(newGameState).toStrictEqual({
        currentPlayerIdTurn: null,
        isFinished: true,
      });
    });
  });

  describe('FARKLE_SCORES', () => {
    it('should return 1000 when diceNumber is 1', () => {
      expect(FARKLE_SCORES.THREE_DICE(1)).toBe(1000);
    });

    it('should return number multiply by dice number when diceNumber is other than 1', () => {
      expect(FARKLE_SCORES.THREE_DICE(4)).toBe(400);
    });

    it('should return 1000 if dice number is other than 1', () => {
      expect(FARKLE_SCORES.FOUR_DICE(6)).toBe(1000);
    });

    it('should return 1500 if dice number is 1', () => {
      expect(FARKLE_SCORES.FOUR_DICE(1)).toBe(1500);
    });
  });
});
