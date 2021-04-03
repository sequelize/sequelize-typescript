/**
 * Removes duplicates from specified array
 */
export function unique<T>(arr: T[]): T[] {
  return arr.filter(uniqueFilter);
}

/**
 * Returns true for items, that only exists once on an array
 */
export const uniqueFilter = <T>(item: T, index: number, arr: T[]): boolean =>
  arr.indexOf(item) === index;
