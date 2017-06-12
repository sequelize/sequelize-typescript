/**
 * Removes duplicates from specified array
 */
export function unique<T>(arr: T[]): T[] {

  return arr.filter(uniqueFilter);
}

/**
 * Returns true for items, that only exists once on an array
 */
export const uniqueFilter = (item, index, arr) => arr.indexOf(item) === index;
