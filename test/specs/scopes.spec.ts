import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {createSequelize} from "../utils/sequelize";
import {getScopeOptions} from "../../lib/services/scopes";
import {ShoeWithScopes, SHOE_DEFAULT_SCOPE, SHOE_SCOPES} from "../models/ShoeWithScopes";
import {Manufacturer} from "../models/Manufacturer";
import {Person} from "../models/Person";

use(chaiAsPromised);

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
    const OWNER = 'bob';

    beforeEach(() => ShoeWithScopes
      .create<ShoeWithScopes>({
        secretKey: 'j435njk3',
        primaryColor: 'red',
        secondaryColor: 'blue',
        producedAt: new Date(),
        manufacturer: {
          brand: BRAND,
          notInScopeBrandOnly: 'invisible :)',
        },
        owner: {
          name: OWNER
        }
      }, {include: [Manufacturer, Person]}));

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

    it('should not consider default scope due to unscoped call', () =>

      ShoeWithScopes
        .unscoped()
        .findOne()
        .then(shoe => {
          expect(shoe).to.have.property('secretKey').which.is.a('string');
        })
    );

    describe('with include options', () => {

      it('should consider scopes and additional included model (object)', () =>
        expect(ShoeWithScopes
          .scope('full')
          .findOne<ShoeWithScopes>({
            include: [{
              model: Person,
            }]
          })
          .then(shoe => {
            expect(shoe).to.have.property('manufacturer').which.is.not.null;
            expect(shoe).to.have.property('manufacturer').which.have.property('brand', BRAND);
            expect(shoe).to.have.property('owner').which.is.not.null;
          })
        ).not.to.be.rejected
      );

      it('should consider scopes and additional included model (model)', () =>
        expect(ShoeWithScopes
          .scope('full')
          .findOne({
            include: [Person]
          })
          .then(shoe => {
            expect(shoe).to.have.property('manufacturer').which.is.not.null;
            expect(shoe).to.have.property('manufacturer').which.have.property('brand', BRAND);
            expect(shoe).to.have.property('owner').which.is.not.null;
          })
        ).not.to.be.rejected
      );

      it('should not consider default scope due to unscoped call, but additonal includes (object)', () =>

        ShoeWithScopes
          .unscoped()
          .findOne({
            include: [{model: Person}]
          })
          .then(shoe => {
            expect(shoe).to.have.property('secretKey').which.is.not.null;
            expect(shoe).to.have.property('owner').which.is.not.null;
          })
      );

      it('should not consider default scope due to unscoped call, but additonal includes (model)', () =>

        ShoeWithScopes
          .unscoped()
          .findOne({
            include: [Person]
          })
          .then(shoe => {
            expect(shoe).to.have.property('secretKey').which.is.not.null;
            expect(shoe).to.have.property('owner').which.is.not.null;
          })
      );

      describe('with using scoped included model', () => {

        it('should consider scope of included model (without own scope)', () =>
          ShoeWithScopes
            .findOne({
              include: [Manufacturer.scope('brandOnly')]
            })
            .then(shoe => {
              expect(shoe).to.have.property('manufacturer')
                .that.have.property('notInScopeBrandOnly')
                .which.is.undefined;
            })
        );

        it('should consider scope of included model (with own scope)', () =>
          ShoeWithScopes
            .scope('red')
            .findOne({
              include: [Manufacturer.scope('brandOnly')]
            })
            .then(shoe => {
              expect(shoe).to.have.property('manufacturer')
                .that.have.property('notInScopeBrandOnly')
                .which.is.undefined;
            })
        );

      });

    });

    describe('with nested scope', () => {

      it('should consider nested scope', () =>
        ShoeWithScopes
          .scope('manufacturerWithScope')
          .findOne()
          .then(shoe => {
            expect(shoe).to.have.property('manufacturer')
              .that.have.property('notInScopeBrandOnly')
              .which.is.undefined;
          })
      );

      it('should not consider nested scope', () =>
        ShoeWithScopes
          .scope('full')
          .findOne()
          .then(shoe => {
            expect(shoe).to.have.property('manufacturer')
              .that.have.property('notInScopeBrandOnly')
              .which.is.a('string');
          })
      );

    });

    describe('with scope function', () => {

      it('should find appropriate shoe due to correctly passed scope function param', () =>
        ShoeWithScopes
          .scope({method: ['primaryColor', 'red']})
          .findOne()
          .then(shoe => {
            expect(shoe).to.have.property('primaryColor', 'red');
          })
      );

      it('should find appropriate shoe due to correctly passed scope function param including associated model', () =>
        ShoeWithScopes
          .scope({method: ['primaryColorWithManufacturer', 'red']})
          .findOne()
          .then(shoe => {
            expect(shoe).to.have.property('primaryColor', 'red');
            expect(shoe).to.have.property('manufacturer').that.is.an('object');
          })
      );

    });

  });

});
