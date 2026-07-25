import { describe, expect, it } from 'vitest';
import { replaceRouteParams } from './router';

describe('router test', () => {
  it('should replace the placeholder by the input param', () => {
    const newUrl = replaceRouteParams('/game/:gameId', { gameId: 'test' });
    expect('/game/test').toBe(newUrl);
  });

  it('should replace multiple placeholders by inputs params', () => {
    const newUrl = replaceRouteParams('/game/:gameId/:id', { gameId: 'test', id: 'good' });
    expect('/game/test/good').toBe(newUrl);
  });

  it('should not do anything if more params are passed than the number of placeholder', () => {
    const newUrl = replaceRouteParams('/game/:gameId/id', { gameId: 'test', id: 'notgood' });
    expect('/game/test/id').toBe(newUrl);
  });

  it('should throw error if param is missing', () => {
    expect(() => replaceRouteParams('/game/:gameId', { id: 'wrong' })).toThrow(
      'Missing param gameId for the route /game/:gameId'
    );
  });
});
