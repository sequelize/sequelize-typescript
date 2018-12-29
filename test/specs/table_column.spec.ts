import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DefineAttributes} from 'sequelize';
import {Model, Table, Column, DataType} from "../../src";
import {createSequelize} from "../utils/sequelize";
import {User} from "../models/User";
import {getOptions} from "../../src/model/shared/model-service";
import {Shoe, SHOE_TABLE_NAME} from "../models/Shoe";
import * as _ from 'lodash';
import {getAttributes} from '../../src/model/column/attribute-service';

use(chaiAsPromised);

/* tslint:disable:max-classes-per-file */

describe('table_column', () => {

  let sequelize;

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
      unique: true,
      defaultValue: DataType.UUIDV4
    },
    username: {
      type: DataType.STRING
    },
    username2: {
      type: DataType.STRING(5)
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

  before(() => sequelize = createSequelize());

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

    it('should not set freezeTableName', () => {
      const userDefineOptions = getOptions(User.prototype);

      expect(userDefineOptions).not.to.have.property('freezeTableName');
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

                expect(attributes[key]).to.have.property(attrOptionKey).that.eql(expectedUserAttributes[key][attrOptionKey]);
              } catch (e) {

                e.message += ` for property "${key}"`;
                throw e;
              }
            });
        });
    });
  });

  describe('rawAttributes', () => {

    let rawAttributes;

    before(() => rawAttributes = User['rawAttributes']);

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

  describe('column', () => {

    it('should create appropriate sql query', () => {

      const seq = createSequelize(false);

      @Table
      class Bottle extends Model<Bottle> {

        @Column(DataType.STRING(5))
        brand: string;

        @Column(DataType.CHAR(2))
        key: string;

        @Column(DataType.INTEGER(100))
        num: number;
      }

      seq.addModels([Bottle]);

      return Bottle.sync({
        force: true, logging: _.after(2, _.once((sql) => {

          // tslint:disable:max-line-length
          expect(sql).to.match(/CREATE TABLE IF NOT EXISTS `Bottle` \(`id` INTEGER PRIMARY KEY AUTOINCREMENT, `brand` VARCHAR\(5\), `key` CHAR\(2\), `num` INTEGER\(100\)\)/);
        }))
      });
    });

  });

  describe('accessors', () => {

    describe('get', () => {

      @Table
      class User extends Model<User> {

        @Column
        get name(): string {
          return 'My name is ' + this.getDataValue('name');
        }

        set name(value: string) {
          this.setDataValue('name', value);
        }
      }

      before(() => sequelize.addModels([User]));

      it('should consider getter', () => {

        const user = new User({});
        user.name = 'Peter';

        expect(user.name).to.equal('My name is Peter');
      });

      it('shouldn\'t store value from getter into db', () => {

        const user = new User({});

        user.name = 'elli';

        return user
          .save()
          .then(() => User.findById(user.id))
          .then(_user => {

            expect(_user.getDataValue('name')).to.equal('elli');
          });
      });

    });

    describe('set', () => {

      @Table
      class User extends Model<User> {

        @Column
        get name(): string {
          return this.getDataValue('name');
        }

        set name(value: string) {
          this.setDataValue('name', value.toUpperCase());
        }
      }

      before(() => sequelize.addModels([User]));

      it('should consider setter', () => {

        const name = 'Peter';

        const user = new User({});
        user.name = name;

        expect(user.name).to.equal(name.toUpperCase());
      });

      it('should store value from setter into db', () => {

        const name = 'elli';
        const user = new User({});

        user.name = name;

        return user
          .save()
          .then(() => User.findById(user.id))
          .then(_user => {

            expect(_user.getDataValue('name')).to.equal(name.toUpperCase());
          });
      });

    });

  });

});
