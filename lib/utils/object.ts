/**
 * Deep copies properties of all sources into target object.
 * The last source overrides all properties of the previous
 * ones, if they have the same names
 */
export function deepAssign<T, S1, S2, S3>(target: T, source1: S1, source2: S2, source3: S3): T & S1 & S2 & S3;
export function deepAssign<T, S1, S2>(target: T, source1: S1, source2: S2): T & S1 & S2;
export function deepAssign<T, S>(target: T, source: S): T & S;
export function deepAssign<S>(target: {}, source: S): S;
export function deepAssign(target: any, ...sources: any[]): any {

  sources.forEach(source => {

    Object
      .getOwnPropertyNames(source)
      .forEach(key => assign(key, target, source))
    ;
    /* istanbul ignore next */
    if (Object.getOwnPropertySymbols) {
      Object
        .getOwnPropertySymbols(source)
        .forEach(key => assign(key, target, source))
      ;
    }
  });
  return target;

  function assign(key: string | number | symbol, _target: any, _source: any): void {
    const sourceValue = _source[key];

    if (sourceValue !== void 0) {
      let targetValue = _target[key];

      if (Array.isArray(sourceValue)) {
        if (!Array.isArray(targetValue)) {
          targetValue = [];
        }
        const length = targetValue.length;

        sourceValue.forEach((_, index) => assign(length + index, targetValue, sourceValue));
      } else if (typeof sourceValue === 'object') {
        if (sourceValue instanceof RegExp) {
          targetValue = cloneRegExp(sourceValue);
        } else if (sourceValue instanceof Date) {
          targetValue = new Date(sourceValue);
        } else if (sourceValue === null) {
          targetValue = null;
        } else {
          if (!targetValue) {
            targetValue = Object.create(sourceValue.constructor.prototype);
          }
          deepAssign(targetValue, sourceValue);
        }
      } else {
        targetValue = sourceValue;
      }
      _target[key] = targetValue;
    }
  }
}

/**
 * I clone the given RegExp object, and ensure that the given flags exist on
 * the clone. The injectFlags parameter is purely additive - it cannot remove
 * flags that already exist on the
 *
 * @param input RegExp - I am the regular expression object being cloned.
 * @param injectFlags String( Optional ) - I am the flags to enforce on the clone.
 * @source https://www.bennadel.com/blog/2664-cloning-regexp-regular-expression-objects-in-javascript.htm
 */
export function cloneRegExp(input: RegExp, injectFlags?: string): RegExp {
  const pattern = input.source;
  let flags = "";
  // Make sure the parameter is a defined string - it will make the conditional
  // logic easier to read.
  injectFlags = ( injectFlags || "" );
  // Test for global.
  if (input.global || ( /g/i ).test(injectFlags)) {
    flags += "g";
  }
  // Test for ignoreCase.
  if (input.ignoreCase || ( /i/i ).test(injectFlags)) {
    flags += "i";
  }
  // Test for multiline.
  if (input.multiline || ( /m/i ).test(injectFlags)) {
    flags += "m";
  }
  // Return a clone with the additive flags.
  return ( new RegExp(pattern, flags) );
}

export function getAllPropertyNames(obj: any): string[] {
  const names: string[] = [];
  do {
    names.push.apply(names, Object.getOwnPropertyNames(obj));
    obj = Object.getPrototypeOf(obj);
  } while (obj !== Object.prototype);

  const exists: { [name: string]: boolean | undefined } = {};

  return names.filter(name => {

    const isValid = !exists[name] && name !== 'constructor';

    exists[name] = true;

    return isValid;
  });
}
