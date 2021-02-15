import { expect } from 'chai';
import { capitalize } from '../../../src/shared/string';

describe('utils', () => {
  describe('string', () => {
    describe('capitalize', () => {
      it('should not throw', () => {
        const value = 'abc';

        expect(() => capitalize(value)).not.to.throw();
      });

      it('should capitalize specified value', () => {
        const value = 'abc';

        expect(capitalize(value)).to.equal('Abc');
      });
    });
  });
});
