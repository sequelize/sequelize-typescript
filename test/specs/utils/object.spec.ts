import {expect} from 'chai';
import {deepAssign} from '../../../lib/utils/object';

/* tslint:disable:max-classes-per-file */

describe('utils', () => {

  describe('object', () => {

    describe('deepAssign', () => {

      const childSourceF = {};
      const childSourceA = {f: childSourceF};
      const childSourceB = {};
      const source1 = {a: childSourceA, b: childSourceB, c: 1, d: 'd', over: 'ride', regex: /reg/gim, notNull: null};
      const source2 = {e: 'für elisa', g: () => null, arr: [{h: 1}, {}, 'e'], over: 'ridden', nullable: null, notNull: 'notNull'};
      const sourceKeys = [].concat(Object.keys(source1), Object.keys(source2));

      it('should not be undefined', () => {

        const copy = deepAssign({}, source1, source2);

        expect(copy).not.to.be.undefined;
      });

      it('should have all keys of sources', () => {

        const copy = deepAssign({}, source1, source2);

        sourceKeys
          .forEach(key => expect(copy).to.have.property(key))
        ;
      });

      it('should override previous properties', () => {

        const copy = deepAssign({}, source1, source2);

        expect(copy).to.have.property('over', 'ridden');
      });

      it('should have all primitive & function values of sources', () => {

        const copy = deepAssign({}, source1, source2);

        sourceKeys
          .forEach(key => {

            if (typeof copy[key] !== 'object') {

              expect(copy[key]).to.equal(source2[key] || source1[key]);
            }
          })
        ;
      });

      it('should have copies of all non-primitive values of sources', () => {

        const copy = deepAssign({}, source1, source2);

        sourceKeys
          .forEach(key => {

            if (typeof copy[key] === 'object' && copy[key] !== null) {

              expect(copy[key]).not.to.equal(source1[key] || source2[key]);
              expect(copy[key]).to.eql(source1[key] || source2[key]);
            }
          })
        ;
      });

      it('should have copies of child source', () => {

        const copy = deepAssign({}, source1, source2);

        expect(copy.a).to.have.property('f');
        expect(copy.a.f).to.not.equal(source1.a.f);
        expect(copy.a.f).to.eql(source1.a.f);
      });

      it('should have copy of array items', () => {

        const copy = deepAssign({}, source1, source2);

        expect(copy.arr).to.be.an('array');

        copy.arr.forEach((value, index) => {

          const isObject = typeof value === 'object';

          if (isObject) {
            expect(value).not.to.equal(source2.arr[index]);
            expect(value).to.eql(source2.arr[index]);

          } else {

            expect(value).to.equal(source2.arr[index]);
          }
        });
      });

      it('should have copy of nullable', () => {
        const copy = deepAssign({}, source1, source2);

        expect(copy.nullable).to.equals(null);
        expect(copy.notNull).to.not.equals(null);

      });

      it('should keep prototype chain', () => {
        class Test {
          protoFn(): any {}
        }
        const copy = deepAssign({}, {test: new Test()});

        expect(copy.test)
          .to.have.property('protoFn')
          .that.is.a('function');
      });

    });

  });
});
