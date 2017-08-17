/* tslint:disable:max-classes-per-file */

import {expect} from 'chai';
import {createSequelize} from "../../utils/sequelize";
import {Game} from "../../models/exports/Game";
import Gamer from "../../models/exports/gamer.model";
import {Sequelize} from "../../../lib/models/Sequelize";
import {Model} from '../../../lib/models/Model';
import {Table} from '../../../lib/annotations/Table';

describe('sequelize', () => {

  const sequelize = createSequelize(false);
  const connectionUri = "sqlite://root@localhost/__";

  function testOptionsProp(instance: Sequelize): void {
    expect(instance).to.have.property('options').that.have.property('dialect').that.eqls('sqlite');
    expect(instance).to.have.property('config').that.have.property('host').that.eqls('localhost');
    expect(instance).to.have.property('config').that.have.property('database').that.eqls('__');
    expect(instance).to.have.property('config').that.have.property('username').that.eqls('root');
  }

  describe('constructor', () => {

    it('should equal Sequelize class', () => {
      expect(sequelize.constructor).to.equal(Sequelize);
    });

  });

  describe('constructor: using "name" property as a db name', () => {

    const db = '__';
    const sequelizeDbName = new Sequelize({
      name: db,
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      logging: !('SEQ_SILENT' in process.env)
    });

    it('should equal Sequelize class', () => {
      expect(sequelizeDbName.constructor).to.equal(Sequelize);
    });

    it('should contain database property, which equal to db.', () => {
      expect(sequelizeDbName)
        .to.have.property('config')
        .that.have.property('database')
        .that.eqls(db);
    });

  });

  describe('constructor using uri in options object', () => {

    const sequelizeUri = new Sequelize({
      uri: connectionUri,
      storage: ':memory:',
      logging: !('SEQ_SILENT' in process.env),
      pool: {max: 8, min: 0}
    });

    it('should equal Sequelize class', () => {
      expect(sequelizeUri.constructor).to.equal(Sequelize);
    });

    it('should contain valid options extracted from connection string', () => {
      testOptionsProp(sequelizeUri);
    });

    it('should contain additional Sequelize options', () => {
      expect(sequelizeUri)
        .to.have.property('options')
        .to.have.property('pool')
        .that.have.property('max')
        .that.eqls(8);
    });

  });

  describe('constructor using uri string', () => {

    const sequelizeUri = new Sequelize(connectionUri);

    it('should equal Sequelize class', () => {
      expect(sequelizeUri.constructor).to.equal(Sequelize);
    });

    it('should contain valid options extracted from connection string', () => {
      testOptionsProp(sequelizeUri);
    });

  });

  describe('global define options', () => {

    const DEFINE_OPTIONS = {timestamps: true, underscoredAll: true};
    const sequelizeWithDefine = createSequelize(false, DEFINE_OPTIONS);

    it('should have define options', () => {
      expect(sequelizeWithDefine)
        .to.have.property('options')
        .that.has.property('define')
        .that.eqls(DEFINE_OPTIONS)
      ;
    });

    it('should set define options for models', () => {
      @Table
      class User extends Model<User> {}
      sequelizeWithDefine.addModels([User]);

      Object
        .keys(DEFINE_OPTIONS)
        .forEach(key => {
          expect(User)
            .to.have.property('options')
            .that.have.property(key, DEFINE_OPTIONS[key]);
        });
    });

  });

  describe('addModels', () => {

    it('should not throw', () => {

      expect(() => sequelize.addModels([__dirname + '/../../models/exports/'])).not.to.throw();
    });

    it('should throw', () => {

      expect(() => sequelize.addModels([__dirname + '/../../models/exports/throws'])).to.throw();
    });

    describe('default exported models', () => {

      it('should work as expected', () => {

        sequelize.addModels([__dirname + '/../../models/exports/']);

        expect(() => Gamer.build({})).not.to.throw;

        const gamer = Gamer.build<Gamer>({nickname: 'the_gamer'});

        expect(gamer.nickname).to.equal('the_gamer');
      });

    });

    describe('named exported models', () => {

      it('should work as expected', () => {

        sequelize.addModels([__dirname + '/../../models/exports/']);

        expect(() => Game.build({})).not.to.throw;

        const game = Game.build<Game>({title: 'Commander Keen'});

        expect(game.title).to.equal('Commander Keen');
      });

    });

    describe('definition files', () => {
      it('should not load in definition files', () => {
        sequelize.addModels([__dirname + '/../../models/exports/']);

        expect(() => Game.build({})).not.to.throw;

        expect(Object.keys(sequelize.models).length).to.equal(2);
      });
    });

  });

  describe('model', () => {

    it('should make class references of loaded models available', () => {

      sequelize.addModels([__dirname + '/../../models/exports/']);

      expect(sequelize._).to.have.property('Game', Game);
      expect(sequelize._).to.have.property('Gamer', Gamer);
    });

  });
});
