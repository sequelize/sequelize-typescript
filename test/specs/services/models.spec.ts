import {expect} from 'chai';
import {
  resolveModelGetter} from '../../../lib/model/shared/model-service';
import {Book} from "../../models/Book";
import {DataType} from "../../../lib/sequelize/enums/DataType";
import {addAttribute, addAttributeOptions, getAttributes, setAttributes} from '../../../lib/model/column/attribute-service';

/* tslint:disable:max-classes-per-file */

describe('services.models', () => {

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

  describe('addAttribute', () => {

    it('should not throw', () => {
      expect(() => addAttribute({}, 'test', {})).to.not.throw();
    });

  });

  describe('getAttributes', () => {

    const target = {};
    const ATTRIBUTES = {name: {primaryKey: true}, age: {type: DataType.NUMBER}};
    setAttributes(target, ATTRIBUTES);

    it('should not return reference but copy of attributes', () => {
      const attributes = getAttributes(target);
      expect(attributes).to.not.equal(ATTRIBUTES);
    });

  });

  describe('addAttributeOptions', () => {

    const target = {};
    const PROPERTY_NAME = 'test';
    const OPTIONS = {allowNull: true};
    addAttribute(target, PROPERTY_NAME, {});
    addAttributeOptions(target, PROPERTY_NAME, OPTIONS);

    it('should be able to retrieve added attribute options', () => {
      const attributes = getAttributes(target);
      expect(Object.keys(attributes)).to.have.property('length', 1);
      expect(Object.keys(attributes[PROPERTY_NAME])).to.have.property('length', Object.keys(OPTIONS).length);
      expect(attributes).to.have.property(PROPERTY_NAME).that.eqls(OPTIONS);
    });

    it('should be able to retrieve added attribute options of prototype linked object', () => {
      const child = Object.create(target);
      const attributes = getAttributes(child);
      expect(Object.keys(attributes)).to.have.property('length', 1);
      expect(Object.keys(attributes[PROPERTY_NAME])).to.have.property('length', Object.keys(OPTIONS).length);
      expect(attributes).to.have.property(PROPERTY_NAME).that.eqls(OPTIONS);
    });

    it('should add new options to child prototype but not parent one', () => {
      const child = Object.create(target);
      const NEW_OPTIONS = {primaryKey: true};
      addAttributeOptions(child, PROPERTY_NAME, NEW_OPTIONS);

      // for child
      const attributes = getAttributes(child);
      expect(Object.keys(attributes)).to.have.property('length', 1);
      expect(Object.keys(attributes[PROPERTY_NAME]))
        .to.have.property(
        'length',
        Object.keys(OPTIONS).length + Object.keys(NEW_OPTIONS).length
      );
      expect(attributes).to.have.property(PROPERTY_NAME).that.eqls({...OPTIONS, ...NEW_OPTIONS});

      // for parent
      const parentAttributes = getAttributes(target);
      expect(Object.keys(parentAttributes)).to.have.property('length', 1);
      expect(Object.keys(parentAttributes[PROPERTY_NAME])).to.have.property('length', Object.keys(OPTIONS).length);
      expect(parentAttributes).to.have.property(PROPERTY_NAME).that.eqls(OPTIONS);
    });

  });

});
