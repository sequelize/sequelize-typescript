import {expect} from 'chai';
import {DefineAttributes} from 'sequelize';
import {DataType} from "../../index";
import {createSequelize} from "../utils/sequelize";
import {User} from "../models/User";
import {getOptions, getAttributes} from "../../lib/services/models";
import {Shoe, SHOE_TABLE_NAME} from "../models/Shoe";

describe('table_column', () => {

  const sequelize = createSequelize();

  const expectedUserAttributes: DefineAttributes = {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataType.INTEGER
    },
    uuidv1: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1
    },
    uuidv4: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
    },
    username: {
      type: DataType.STRING
    },
    aNumber: {
      type: DataType.INTEGER
    },
    bNumber: {
      type: DataType.INTEGER
    },
    isAdmin: {
      type: DataType.BOOLEAN
    },
    isSuperUser: {
      type: DataType.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    touchedAt: {
      type: DataType.DATE,
      defaultValue: DataType.NOW
    },
    birthDate: {
      type: DataType.DATE
    },
    dateAllowNullTrue: {
      allowNull: true,
      type: DataType.DATE
    },
    name: {
      type: DataType.STRING
    },
    bio: {
      type: DataType.TEXT
    },
    email: {
      type: DataType.STRING
    }
  };

  beforeEach(() => sequelize.sync({force: true}));

  describe('define options', () => {

    it('should be retrievable from class prototype', () => {
      const userDefineOptions = getOptions(User.prototype);
      expect(userDefineOptions).not.to.be.undefined;

      const shoeDefineOptions = getOptions(Shoe.prototype);
      expect(shoeDefineOptions).not.to.be.undefined;
    });

    it('should be retrievable from an instance', () => {
      const user = new User();
      const userDefineOptions = getOptions(user);
      expect(userDefineOptions).not.to.be.undefined;

      const shoe = new Shoe();
      const shoeDefineOptions = getOptions(shoe);
      expect(shoeDefineOptions).not.to.be.undefined;
    });

    it('should have automatically inferred tableName', () => {
      const userDefineOptions = getOptions(User.prototype);

      expect(userDefineOptions).to.have.property('tableName', User.name);
    });

    it('should have explicitly defined tableName', () => {
      const shoeDefineOptions = getOptions(Shoe.prototype);

      expect(shoeDefineOptions).to.have.property('tableName', SHOE_TABLE_NAME);
    });

    it('should have class methods', () => {
      const userDefineOptions = getOptions(User.prototype);
      expect(userDefineOptions).to.have.property('classMethods', User);

      const shoeDefineOptions = getOptions(Shoe.prototype);
      expect(shoeDefineOptions).to.have.property('classMethods', Shoe);
    });

    it('should have instance methods', () => {
      const userDefineOptions = getOptions(User.prototype);
      expect(userDefineOptions).to.have.property('instanceMethods', User.prototype);

      const shoeDefineOptions = getOptions(Shoe.prototype);
      expect(shoeDefineOptions).to.have.property('instanceMethods', Shoe.prototype);
    });
  });

  describe('attribute options', () => {

    it('should be retrievable from class prototype', () => {
      const attributes = getAttributes(User.prototype);

      expect(attributes).not.to.be.undefined;
    });

    it('should be retrievable from an instance', () => {
      const user = new User();
      const attributes = getAttributes(user);

      expect(attributes).not.to.be.undefined;
    });

    it('should have annotated attributes', () => {

      const attributes = getAttributes(User.prototype);

      Object
        .keys(expectedUserAttributes)
        .forEach(key => {

          expect(attributes).to.have.property(key);

          Object
            .keys(expectedUserAttributes[key])
            .forEach(attrOptionKey => {

              try {

                expect(attributes[key]).to.have.property(attrOptionKey, expectedUserAttributes[key][attrOptionKey]);
              } catch (e) {

                e.message += ` for property "${key}"`;
                throw e;
              }
            });
        });
    });
  });

  describe('rawAttributes', () => {

    const rawAttributes = User['rawAttributes'];

    it('should have annotated attributes', () => {

      Object
        .keys(expectedUserAttributes)
        .forEach(key => {
          expect(rawAttributes).to.have.property(key);
        });
    });

    it('should not have attributes, that are note annotated by column decorator', () => {

      expect(rawAttributes).not.to.have.property('extraField');
      expect(rawAttributes).not.to.have.property('extraField2');
      expect(rawAttributes).not.to.have.property('extraField3');
    });

    it('should have passed attribute options', () => {

      const uidv1SeqRawAttrOptions = rawAttributes.uuidv1;

      expect(uidv1SeqRawAttrOptions).to.have.property('type');
      expect(uidv1SeqRawAttrOptions.type).to.be.an.instanceOf(DataType.UUID);
      expect(uidv1SeqRawAttrOptions).to.have.property('defaultValue');
      expect(uidv1SeqRawAttrOptions.defaultValue).to.be.an.instanceof(DataType.UUIDV1);

      const uidv4SeqRawAttrOptions = rawAttributes.uuidv4;

      expect(uidv4SeqRawAttrOptions).to.have.property('type');
      expect(uidv4SeqRawAttrOptions.type).to.be.an.instanceOf(DataType.UUID);
      expect(uidv4SeqRawAttrOptions).to.have.property('defaultValue');
      expect(uidv4SeqRawAttrOptions.defaultValue).to.be.an.instanceof(DataType.UUIDV4);
    });

  });

});
