/* tslint:disable:max-classes-per-file */
import {expect} from 'chai';
import {addForeignKey} from "../../../src/associations/foreign-key/foreign-key-service";
import {Model} from "../../../src/model/model/model";
import {getForeignKeys} from '../../../src/associations/foreign-key/foreign-key-service';

describe('service.association', () => {

  describe('addForeignKey', () => {

    it('should add foreign key to target metadata', () => {
      const target = {};
      const FOREIGN_KEY = 'testId';
      const RELATED_CLASS_GETTER = () => class T extends Model {};
      addForeignKey(target, RELATED_CLASS_GETTER, FOREIGN_KEY);
      const foreignKeys = getForeignKeys(target);

      expect(foreignKeys).to.have.property('length', 1);
      expect(foreignKeys[0]).to.eql({
        foreignKey: FOREIGN_KEY,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });
    });

    it('should add foreign key to target metadata, but not parent', () => {
      const parent = {};
      const target = Object.create(parent);
      const FOREIGN_KEY = 'testId';
      const PARENT_FOREIGN_KEY = 'parentTestId';
      const RELATED_CLASS_GETTER = () => class T extends Model {};
      addForeignKey(parent, RELATED_CLASS_GETTER, PARENT_FOREIGN_KEY);
      addForeignKey(target, RELATED_CLASS_GETTER, FOREIGN_KEY);

      const foreignKeys = getForeignKeys(target);
      expect(foreignKeys).to.have.property('length', 2);
      expect(foreignKeys[0]).to.eql({
        foreignKey: PARENT_FOREIGN_KEY,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });
      expect(foreignKeys[1]).to.eql({
        foreignKey: FOREIGN_KEY,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });

      const parentForeignKeys = getForeignKeys(parent);
      expect(parentForeignKeys).to.have.property('length', 1);
      expect(parentForeignKeys[0]).to.eql({
        foreignKey: PARENT_FOREIGN_KEY,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });
    });

  });

});
