import {expect} from 'chai';
import {createSequelize} from "../utils/sequelize";
import {getScopeOptions} from "../../lib/services/models";
import {ShoeWithScopes, SHOE_DEFAULT_SCOPE, SHOE_SCOPES} from "../models/ShoeWithScopes";
import {Manufacturer} from "../models/Manufacturer";

describe('scopes', () => {

  const sequelize = createSequelize();

  beforeEach(() => sequelize.sync({force: true}));

  describe('options', () => {

    it('should be retrievable from class prototype', () => {
      const showScopeOptions = getScopeOptions(ShoeWithScopes.prototype);
      expect(showScopeOptions).not.to.be.undefined;
    });

    it('should contain default and other scopes', () => {
      const showScopeOptions = getScopeOptions(ShoeWithScopes.prototype);

      expect(showScopeOptions).to.have.property('defaultScope').that.eqls(SHOE_DEFAULT_SCOPE);
      expect(showScopeOptions).to.have.property('full').that.eqls(SHOE_SCOPES.full);
    });
  });

  describe('find', () => {

    const BRAND = 'adiwas';

    beforeEach(() => ShoeWithScopes
      .create<ShoeWithScopes>({
        secretKey: 'j435njk3',
        primaryColor: 'red',
        secondaryColor: 'blue',
        producedAt: new Date(),
        manufacturer: {
          brand: BRAND
        }
      }, {include: [Manufacturer]}));

    it('should consider default scope', () =>

      ShoeWithScopes.findOne()
        .then(shoe => {

          expect(Object.keys(shoe['dataValues'])).to.eql(SHOE_DEFAULT_SCOPE.attributes);
        })
    );

    it('should consider other scopes', () =>

      ShoeWithScopes.scope('full').findOne()
        .then(shoe => {

          expect(shoe).to.have.property('manufacturer').which.is.not.null;
          expect(shoe).to.have.property('manufacturer').which.have.property('brand', BRAND);
        })
        .then(() => ShoeWithScopes.scope('yellow').findAll())
        .then(yellowShoes => {

          expect(yellowShoes).to.be.empty;
        })
    );

  });

});
