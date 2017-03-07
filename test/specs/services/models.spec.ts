import {expect} from 'chai';
import {resolveModelGetter} from '../../../lib/services/models';
import {Book} from "../../models/Book";

/* tslint:disable:max-classes-per-file */

describe('services', () => {

  describe('models', () => {

    describe('resolveModelGetter', () => {

      const options = {
        a: () => Book,
        b: () => null,
        c: {
          c1: () => Book,
          c2: () => null
        }
      };

      resolveModelGetter(options);

      it('should resolve getter', () => {

        expect(options.a).to.be.equal(Book);
        expect(options.c.c1).to.be.equal(Book);
      });

      it('should not resolve other functions', () => {

        expect(options.b).to.be.a('function');
        expect(options.c.c2).to.be.a('function');
      });
    });

  });
});
