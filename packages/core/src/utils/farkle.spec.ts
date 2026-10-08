import { beforeEach, describe, expect, it } from 'vitest';
import type { Game, GamePlayer } from '../types';
import {
  advanceTurn,
  type BankScoreState,
  bankScore,
  canBankScore,
  DEFAULT_FARKLE_SETTINGS,
  FARKLE_SCORES,
  getNextPlayerId,
  hasReachedWinningScore,
} from './farkle';

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

let state: BankScoreState;
const setState = (changes: Partial<BankScoreState>) => {
  state = { ...state, ...changes };
};

const game: Game = {
  id: 'game',
  currentPlayerIdTurn: 'first',
  scoreToReach: 1000,
  exactScoreRequired: true,
  players: ['first', 'second'].map((id) => ({
    id,
    name: id,
    score: 0,
    previewScore: 500,
    hasScored: false,
    consecutiveFarkles: 2,
  })),
};

beforeEach(() => {
  setState({
    game: structuredClone(game),
    settings: {
      ...DEFAULT_FARKLE_SETTINGS,
      sixDiceFarkle: { enabled: true, score: 500 },
      revertPlayerScoreOnSameScore: true,
    },
    history: [],
    turnHistory: [],
  });
});

const updateGame = (changes: Partial<Game>) => {
  setState({ game: { ...game, ...state.game, ...changes } });
};

describe.each(['bank', 'sixDiceFarkle'] as const)('%s scoring rules', (action) => {
  const score = () => {
    const amount =
      action === 'sixDiceFarkle'
        ? state.settings.sixDiceFarkle.score
        : (state.game?.players.find((player) => player.id === state.game?.currentPlayerIdTurn)?.previewScore ?? 0);
    const result = bankScore(state, amount, action === 'sixDiceFarkle');
    if (result !== state) setState(result);
  };

  it('rejects a first score below the minimum without changing history or turn', () => {
    setState({
      settings: { ...state.settings, minimumFirstScore: { enabled: true, score: 600 } },
    });
    const before = state;
    expect(canBankScore(before.game, before.settings, 500)).toBe(false);
    score();
    expect(state).toBe(before);
  });

  it('allows the minimum first score and records only the banked amount', () => {
    score();
    expect(state.game?.players[0]).toMatchObject({
      score: 500,
      previewScore: 0,
      hasScored: true,
      consecutiveFarkles: 0,
    });
    expect(state.game?.currentPlayerIdTurn).toBe('second');
    expect(state.turnHistory[0]).toMatchObject({ scoreBanked: 500, isFarkle: false });
    expect(state.turnHistory[0].isSixDiceFarkle).toBe(action === 'sixDiceFarkle' ? true : undefined);
  });

  it('allows a smaller score after the player has already scored', () => {
    updateGame({ players: [{ ...game.players[0], score: 100, hasScored: true }, game.players[1]] });
    setState({
      settings: { ...state.settings, minimumFirstScore: { enabled: true, score: 600 } },
    });
    score();
    expect(state.game?.players[0].score).toBe(600);
  });

  it('rejects exceeding the exact winning score', () => {
    updateGame({ players: [{ ...game.players[0], score: 600, hasScored: true }, game.players[1]] });
    const before = state;
    expect(canBankScore(before.game, before.settings, 500)).toBe(false);
    score();
    expect(state).toBe(before);
  });

  it.each([true, false])('starts the final round when reaching the target (exact: %s)', (exactScoreRequired) => {
    updateGame({ exactScoreRequired, players: [{ ...game.players[0], score: 500, hasScored: true }, game.players[1]] });
    score();
    expect(state.game).toMatchObject({ finalRoundStartedByPlayerId: 'first', isFinished: false });
    updateGame({
      players: state.game?.players.map((player) => ({ ...player, previewScore: 500 })),
    });
    score();
    expect(state.game).toMatchObject({ isFinished: true, currentPlayerIdTurn: null });
  });

  it('allows exceeding the target when exact score is disabled', () => {
    updateGame({
      exactScoreRequired: false,
      players: [{ ...game.players[0], score: 600, hasScored: true }, game.players[1]],
    });
    score();
    expect(state.game).toMatchObject({ finalRoundStartedByPlayerId: 'first' });
    expect(state.game?.players[0].score).toBe(1100);
  });

  it('reverts a matching opponent to their most recent different score and preserves history', () => {
    updateGame({ players: [game.players[0], { ...game.players[1], score: 500, hasScored: true }] });
    setState({ history: [{ ...game, players: [game.players[0], { ...game.players[1], score: 200 }] }] });
    const before = state.game;
    score();
    expect(state.game?.players[1].score).toBe(200);
    expect(state.history.at(-1)).toEqual(before);
  });

  it('does not revert matching scores during the final round', () => {
    updateGame({
      finalRoundStartedByPlayerId: 'second',
      players: [game.players[0], { ...game.players[1], score: 500 }],
    });
    setState({ history: [game] });
    score();
    expect(state.game?.players[1].score).toBe(500);
  });
});
