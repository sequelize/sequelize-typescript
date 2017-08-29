/* tslint:disable:max-classes-per-file */

import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {DefineValidateOptions} from "sequelize";
import {createSequelize, createSequelizeValidationOnly} from "../utils/sequelize";
import {
  ShoeWithValidation, KEY_VALUE, PARTIAL_SPECIAL_VALUE, BRAND_LENGTH,
  hexColor, HEX_REGEX, PRODUCED_AT_IS_AFTER, PRODUCED_AT_IS_BEFORE, UUID_VERSION, MAX, MIN, NOT, IS_IN, NOT_CONTAINS
} from "../models/ShoeWithValidation";
import {majorVersion} from "../../lib/utils/versioning";
import {Is} from "../../lib/annotations/validation/Is";
import {Model} from "../../lib/models/Model";
import {Table} from "../../lib/annotations/Table";
import {Column} from "../../lib/annotations/Column";
import {Length} from "../../lib/annotations/validation/Length";
import {NotEmpty} from "../../lib/annotations/validation/NotEmpty";

use(chaiAsPromised);

describe('validation', () => {

  const sequelize = createSequelize();

  beforeEach(() => sequelize.sync({force: true}));

  describe(`rawAttributes of ${ShoeWithValidation.name}`, () => {

    const rawAttributes = ShoeWithValidation['rawAttributes'];
    const shoeAttributes: { [key: string]: DefineValidateOptions } = {
      id: {
        isUUID: UUID_VERSION
      },
      key: {
        equals: KEY_VALUE
      },
      special: {
        contains: PARTIAL_SPECIAL_VALUE
      },
      brand: {
        len: [BRAND_LENGTH.min, BRAND_LENGTH.max]
      },
      brandUrl: {
        isUrl: true
      },
      primaryColor: {
        isHexColor: hexColor
      },
      secondaryColor: {
        isHexColor: hexColor
      },
      tertiaryColor: {
        is: HEX_REGEX
      },
      producedAt: {
        isDate: true,
        isAfter: PRODUCED_AT_IS_AFTER,
        isBefore: PRODUCED_AT_IS_BEFORE,
      },
      dummy: {
        isCreditCard: true,
        isAlpha: true,
        isAlphanumeric: true,
        isEmail: true,
        isDecimal: true,
        isFloat: true,
        isInt: true,
        isIP: true,
        isIPv4: true,
        isIPv6: true,
        isLowercase: true,
        isUppercase: true,
        notNull: true,
        max: MAX,
        min: MIN,
        not: NOT,
        isIn: IS_IN,
        notIn: IS_IN,
        notContains: NOT_CONTAINS,
        isArray: true,
      }
    };

    it(`should have properties with defined validations`, () => {
      Object
        .keys(shoeAttributes)
        .forEach(key => {


          expect(rawAttributes[key]).to.have.property('validate');
          const validations = shoeAttributes[key];

          Object
            .keys(validations)
            .forEach(validateKey => {

              expect(rawAttributes[key].validate).to.have.property(validateKey)
                .that.eqls(validations[validateKey]);
            });

        });
    });

  });

  describe('validation', () => {

    const data: { [key: string]: { valid: any[]; invalid: any[] } } = {
      id: {
        valid: ['903830b8-4dcc-4f10-a5aa-35afa8445691', null, undefined],
        invalid: ['', 'abc', 1],
      },
      key: {
        valid: [KEY_VALUE, null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      special: {
        valid: [
          `abc${PARTIAL_SPECIAL_VALUE}`,
          `abc${PARTIAL_SPECIAL_VALUE}def`,
          `${PARTIAL_SPECIAL_VALUE}def`,
          `_${PARTIAL_SPECIAL_VALUE}_`
        ],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      brand: {
        valid: ['nike', 'adidas', 'puma', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      brandUrl: {
        valid: ['http://www.google.de', 'https://www.google.com', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      primaryColor: {
        valid: ['#666', '#666555', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      secondaryColor: {
        valid: ['#666', '#666555', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      tertiaryColor: {
        valid: ['#666', '#666555', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      producedAt: {
        valid: [new Date(2010, 1, 1), null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2, new Date(1980, 1, 1)],
      }
    };

    const validPromises = [];
    const invalidPromises = [];

    Object
      .keys(data)
      .forEach(key => {

        const valid = data[key].valid;
        const invalid = data[key].invalid;

        validPromises.push(Promise.all(valid.map(value => {

          const shoe = new ShoeWithValidation({[key]: value});

          if (majorVersion === 3) {

            return shoe.validate().then(err => expect(err).to.be.null);
          } else if (majorVersion === 4) {

            return expect(shoe.validate()).to.be.fulfilled;
          }
        })));

        invalidPromises.push(Promise.all(invalid.map(value => {

          const shoe = new ShoeWithValidation({[key]: value});

          if (majorVersion === 3) {

            return shoe.validate().then(err => expect(err).to.be.an('object'));
          } else if (majorVersion === 4) {

            return expect(shoe.validate()).to.be.rejected;
          }
        })));

      });

    it(`should not throw due to valid values`, () => Promise.all(validPromises));
    it(`should throw due to invalid values`, () => Promise.all(invalidPromises));

  });

  describe('decorators', () => {

    describe('Is', () => {

      it('Should throw due to missing name of function', () => {
        expect(() => Is(() => null)).to.throw(/Passed validator function must have a name/);
      });

    });

    describe('Length', () => {

      it('should not produce an error', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 0, max: 5}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.not.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.not.rejected;
        }
      });

      it('should produce an error due to unfulfilled max', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 0, max: 5}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa tree'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.rejected;
        }
      });

      it('should produce an error due to unfulfilled min', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 5, max: 5}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elli'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.rejected;
        }
      });

      it('should not produce an error (max only)', () => {
        @Table
        class User extends Model<User> {
          @Length({max: 5}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.not.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.not.rejected;
        }
      });

      it('should produce an error (max only)', () => {
        @Table
        class User extends Model<User> {
          @Length({max: 5}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa tree'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.rejected;
        }
      });

      it('should not produce an error (min only)', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 4}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.not.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.not.rejected;
        }
      });

      it('should produce an error (min only)', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 5}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elli'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.rejected;
        }
      });

    });

    describe('NotEmpty', () => {

      it('should not produce an error', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.not.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.not.rejected;
        }
      });

      it('should produce an error', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: ''});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.rejected;
        }
      });

      it('should not produce an error (with msg)', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty({msg: 'NotEmpty'}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err).to.be.not.an('object'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.not.rejected;
        }
      });

      it('should produce an error (with msg)', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty({msg: 'NotEmpty'}) @Column name: string;
        }
        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: ''});

        if (majorVersion === 3) {
          return user.validate().then(err => expect(err.errors[0].message).to.eq('NotEmpty'));
        } else if (majorVersion === 4) {
          return expect(user.validate()).to.be.rejected;
        }
      });
    });

  });

  describe('only', () => {

    it('should not throw', () => {

      expect(() => createSequelizeValidationOnly()).not.to.throw();
    });

  });

});
