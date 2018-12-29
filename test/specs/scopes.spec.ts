import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {useFakeTimers} from 'sinon';
import {Op} from 'sequelize';
import {createSequelize} from "../utils/sequelize";
import {getScopeOptions} from "../../src/scopes/shared/scope-service";
import {ShoeWithScopes, SHOE_DEFAULT_SCOPE, SHOE_SCOPES} from "../models/ShoeWithScopes";
import {Manufacturer} from "../models/Manufacturer";
import {Person} from "../models/Person";
import {Model} from '../../src/model/model/model';
import {Table} from '../../src/model/table/table';
import {Scopes} from '../../src/scopes/scopes';
import {Column} from '../../src/model/column/column';
import {UpdatedAt} from '../../src/model/column/timestamps/updated-at';
import chaiDatetime = require('chai-datetime');

use(chaiAsPromised);
use(chaiDatetime);

describe('scopes', () => {

  let sequelize;

  before(() => sequelize = createSequelize());

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
      .create({
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
        .then(() => (ShoeWithScopes.scope('yellow') as typeof ShoeWithScopes).findAll())
        .then(yellowShoes => {

          expect(yellowShoes).to.be.empty;
        })
        .then(() => (ShoeWithScopes.scope('noImg') as typeof ShoeWithScopes).findAll())
        .then(noImgShoes => {

          expect(noImgShoes).to.be.not.empty;
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
        expect(
          ShoeWithScopes.scope('full')
            .findOne({
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
        expect(
          ShoeWithScopes.scope('full')
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

        ShoeWithScopes.unscoped()
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
          ShoeWithScopes.scope('red')
            .findOne({
              include: [Manufacturer.scope('brandOnly') as typeof Manufacturer]
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
        ShoeWithScopes.scope('manufacturerWithScope')
          .findOne()
          .then(shoe => {
            expect(shoe).to.have.property('manufacturer')
              .that.have.property('notInScopeBrandOnly')
              .which.is.undefined;
          })
      );

      it('should not consider nested scope', () =>
        ShoeWithScopes.scope('full')
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
        ShoeWithScopes.scope({method: ['primaryColor', 'red']})
          .findOne()
          .then(shoe => {
            expect(shoe).to.have.property('primaryColor', 'red');
          })
      );

      it('should find appropriate shoe due to correctly passed scope function param including associated model', () =>
        ShoeWithScopes.scope({method: ['primaryColorWithManufacturer', 'red']})
          .findOne()
          .then(shoe => {
            expect(shoe).to.have.property('primaryColor', 'red');
            expect(shoe).to.have.property('manufacturer').that.is.an('object');
          })
      );

    });

    describe('with symbols', () => {
      let _sequelize;

      @Scopes({
        bob: {where: {name: {[Op.like]: '%bob%'}}},
        updated: {where: {updated: {[Op.gt]: new Date(2000, 1)}}},
      })
      @Table
      class Person extends Model<Person> {

        @Column
        name: string;

        @UpdatedAt
        updated: Date;
      }

      before(() => {
        _sequelize = createSequelize(false);
        _sequelize.addModels([Person]);
      });

      beforeEach(() => _sequelize.sync({force: true}));

      it('should consider symbols while finding elements', () => {
        return Person
          .create({name: '1bob2'})
          .then(() => Person.create({name: 'bob'}))
          .then(() => Person.create({name: 'bobby'}))
          .then(() => Person.create({name: 'robert'}))
          .then(() => (Person.scope('bob') as typeof Person).findAll())
          .then(persons => expect(persons).to.have.property('length', 3))
          ;
      });

      it('should consider symbols on timestamp column while finding elements', () => {
        const clock = useFakeTimers(+new Date());
        return Person
          .create({name: 'test'})
          .then(() => (Person.scope('updated') as typeof Person).findAll())
          .then(() => Person.findAll())
          .then(persons => expect(persons).to.have.property('length', 1))
          .then(() => clock.restore())
          ;
      });

    });

  });

});
