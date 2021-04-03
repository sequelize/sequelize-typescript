import { expect } from 'chai';

/**
 * Compares instance with expected values
 */
export function assertInstance(instance: any | any[], expectedValues: any | any[]): void {
  if (Array.isArray(expectedValues)) {
    expect(instance).to.have.property('length', expectedValues.length);

    return instance.forEach((_instance, i) => assertInstance(_instance, expectedValues[i]));
  }

  expect(instance).to.have.property('id').that.is.not.null;

  Object.keys(expectedValues).forEach((key) => {
    const value = instance[key];
    const expectedValue = expectedValues[key];

    expect(instance).to.have.property(key).that.is.not.null.and.not.undefined;

    if (typeof expectedValue === 'object') {
      assertInstance(value, expectedValue);
    } else {
      expect(instance).to.have.property(key, expectedValue);
    }
  });
}
