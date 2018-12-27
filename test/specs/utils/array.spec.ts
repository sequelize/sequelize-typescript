import {expect} from 'chai';
import {unique} from '../../../src/shared/array';

/* tslint:disable:max-classes-per-file */

describe('utils', () => {

  describe('array', () => {

    describe('unique', () => {

      const duplicates = [1, 'a', 'b', 1, 'a', 'c', 2, 'd', 'b', 2, 3, 'd', 'b'];

      it('should not throw', () => {

        expect(() => unique(duplicates)).not.to.throw();
      });

      it('should remove duplicates from array', () => {

        const unified = unique(duplicates);

        expect(unified).to.have.property('length', 7);
      });

    });

  });
});
