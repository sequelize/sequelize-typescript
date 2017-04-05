import {expect} from 'chai';

/**
 * Compares instance with expected values
 */
export function assertInstance(instance: any|any[], expectedValues: any|any[]): void {

  if (Array.isArray(expectedValues)) {

    expect(instance).to.have.property('length', expectedValues.length);

    return instance.forEach((_instance, i) => assertInstance(_instance, expectedValues[i]));
  }

  expect(instance)
    .to.have.property('id')
    .that.is.not.null;

  Object
    .keys(expectedValues)
    .forEach(key => {

      const value = instance[key];
      const expectedValue = expectedValues[key];

      expect(instance).to.have.property(key)
        .that.is.not.null.and.not.undefined;

      if (typeof expectedValue === 'object') {

        assertInstance(value, expectedValue);
      } else {

        expect(instance).to.have.property(key, expectedValue);
      }

    });
}

/**
 * Checks if specified value contains es6 syntax or not;
 * @returns true if it contains es6 syntax
 */
export function containsEs6Syntax(value: string): boolean {

  // tslint:disable:max-line-length
  const ES6_SYNTAX_REGEX = /(^class | class )|(^const | const )|(^let | let )|(^async | async )|(^await | await )|(^yield | yield )|(=>)|function\*|\`/gm;

  return ES6_SYNTAX_REGEX.test(
    value
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '') // remove /** */ and /* */ // comments
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/gm, '') // remove all quotes
  );
}
