/**
 * Compare two semver versions
 * @param versionA Server version
 * @param versionB Local version
 * @returns boolean
 */
export const semverGreaterThan = (versionA: string, versionB: string) => {
  const versionsA = versionA.split(/\./g);

  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());

    const b = Number(versionsB.shift());

    if (a === b) continue;
    return a > b || Number.isNaN(b);
  }
  return false;
};
