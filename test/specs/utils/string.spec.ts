import {expect} from 'chai';
import {capitalize} from '../../../lib/shared/string';

/* tslint:disable:max-classes-per-file */

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
