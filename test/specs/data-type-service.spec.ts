import {expect} from 'chai';
import {DataTypes} from 'sequelize';
import { AutoIncrement, Column, Model, PrimaryKey, Table } from '../../src';
import {createSequelize} from "../utils/sequelize";
import {getAttributes} from '../../src/model/column/attribute-service';

describe('data type service', () => {
  describe('inferDataTypes',  () => {
    it('correctly infers bigint data type', () => {

      @Table
      class BigIntModel extends Model {
        @PrimaryKey
        @AutoIncrement
        @Column
        id: bigint;
      }

      const sequelize = createSequelize();
      sequelize.addModels([BigIntModel]);

      const attributes = getAttributes(BigIntModel.prototype);

      expect(attributes.id.type).to.equal(DataTypes.BIGINT);
    });
  });
});
