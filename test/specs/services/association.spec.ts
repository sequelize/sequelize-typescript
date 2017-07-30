/* tslint:disable:max-classes-per-file */
import {expect} from 'chai';
import {addAssociation, addForeignKey, getAssociations, getForeignKeys} from "../../../lib/services/association";
import {Model} from "../../../lib/models/Model";

describe('service.association', () => {

  describe('addAssociation', () => {

    it('should add association to target metadata', () => {
      const target = {};
      const RELATION = 'hasMany';
      const AS_NAME = 'test';
      const RELATED_CLASS_GETTER = () => class T extends Model<T> {};
      addAssociation(target, RELATION, RELATED_CLASS_GETTER, AS_NAME);
      const associations = getAssociations(target);

      expect(associations).to.have.property('length', 1);
      expect(associations[0]).to.eql({
        relation: RELATION,
        options: {},
        through: undefined,
        throughClassGetter: undefined,
        as: AS_NAME,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });
    });

    it('should add association to target metadata, but not parent', () => {
      const parent = {};
      const target = Object.create(parent);
      const RELATION = 'hasMany';
      const PARENT_RELATION = 'belongsToMany';
      const AS_NAME = 'test';
      const RELATED_CLASS_GETTER = () => class T extends Model<T> {};
      addAssociation(parent, PARENT_RELATION, RELATED_CLASS_GETTER, AS_NAME);
      addAssociation(target, RELATION, RELATED_CLASS_GETTER, AS_NAME);

      const associations = getAssociations(target);
      expect(associations).to.have.property('length', 2);
      expect(associations[0]).to.eql({
        relation: PARENT_RELATION,
        options: {},
        through: undefined,
        throughClassGetter: undefined,
        as: AS_NAME,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });
      expect(associations[1]).to.eql({
        relation: RELATION,
        options: {},
        through: undefined,
        throughClassGetter: undefined,
        as: AS_NAME,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });

      const parentAssociations = getAssociations(parent);
      expect(parentAssociations).to.have.property('length', 1);
      expect(parentAssociations[0]).to.eql({
        relation: PARENT_RELATION,
        options: {},
        through: undefined,
        throughClassGetter: undefined,
        as: AS_NAME,
        relatedClassGetter: RELATED_CLASS_GETTER,
      });
    });

  });

  describe('addForeignKey', () => {

    it('should add foreign key to target metadata', () => {
      const target = {};
      const FOREIGN_KEY = 'testId';
      const RELATED_CLASS_GETTER = () => class T extends Model<T> {};
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
      const RELATED_CLASS_GETTER = () => class T extends Model<T> {};
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
