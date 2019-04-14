import {expect} from 'chai';
import {DataType} from "../../../src/sequelize/data-type/data-type";
import {inferDataType, isDataType} from '../../../src/sequelize/data-type/data-type-service';

/* tslint:disable:max-classes-per-file */

describe('utils', () => {

  describe('data-type', () => {

    describe('isDataType', () => {

      it('should return true', () => {

        Object
          .keys(DataType)
          .forEach(key => {

            if (key.toUpperCase() === key) {

              expect(isDataType(DataType[key])).to.be.true;
            }
          });

        expect(isDataType(DataType.STRING(55))).to.be.true;
        expect(isDataType(DataType.ENUM('a', 'b'))).to.be.true;
        expect(isDataType(DataType.ARRAY(DataType.STRING))).to.be.true;
        expect(isDataType('VARCHAR(255)')).to.be.true;
      });

      it('should return false', () => {

        expect(isDataType(function(): void {})).to.be.false;
        expect(isDataType(() => null)).to.be.false;
        expect(isDataType({})).to.be.false;
      });
    });

    describe('inferDataType', () => {

      it('should return appropriate sequelize data type', () => {

        expect(inferDataType(Number)).to.equal(DataType.INTEGER);
        expect(inferDataType(Boolean)).to.equal(DataType.BOOLEAN);
        expect(inferDataType(Date)).to.equal(DataType.DATE);
        expect(inferDataType(String)).to.equal(DataType.STRING);
      });

      it('should return undefined', () => {

        expect(inferDataType('abc')).to.be.undefined;
        expect(inferDataType(function(): void {})).to.be.undefined;
        expect(inferDataType(() => null)).to.be.undefined;
        expect(inferDataType({})).to.be.undefined;
        expect(inferDataType(class hey {})).to.be.undefined;
      });
    });
  });
});
