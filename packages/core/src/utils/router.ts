export const replaceRouteParams = (route: string, params: Record<string, string>): string => {
  const neededParams = Array.from(route.matchAll(/:([A-Za-z0-9_]+)/g)).map((m) => m[1]);
  for (const key of neededParams) {
    if (!(key in params)) throw new Error(`Missing param ${key} for the route ${route}`);
  }
  return route.replace(/:([A-Za-z0-9_]+)/g, (_match, key: string) => encodeURIComponent(String(params[key])));
};
