export const FARKLE_SCORES = {
  FIFTY: 50,
  HUNDRED: 100,
  THREE_DICE: (diceNumber: number) => (diceNumber === 1 ? 1000 : diceNumber * 100),
  FOUR_DICE: (diceNumber: number) => (diceNumber === 1 ? 1500 : 1000),
  STRAIGHT: 1500,
  THREE_PAIR: 1500,
  FIVE_DICE: 2000,
  SIX_DICE: 3000,
  FOUR_DICE_ONE_PAIR: 1500,
  TWO_TRIPLETS: 2500,
};

export const TRIPLE_ONE_SCORE_OPTIONS = [300, 1000] as const;

export const replaceRouteParams = (route: string, params: Record<string, string>): string => {
  const neededParams = Array.from(route.matchAll(/:([A-Za-z0-9_]+)/g)).map((m) => m[1]);
  for (const key of neededParams) {
    if (!(key in params)) throw new Error(`Missing param ${key} for the route ${route}`);
  }
  return route.replace(/:([A-Za-z0-9_]+)/g, (_match, key: string) => encodeURIComponent(String(params[key])));
};
