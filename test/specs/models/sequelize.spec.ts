import { expect } from 'chai';
import { createSequelize } from '../../utils/sequelize';
import { Game } from '../../models/exports/Game';
import Gamer from '../../models/exports/gamer.model';
import PlayerGlob from '../../models/globs/match-sub-dir-files/players/player.model';
import ShoeGlob from '../../models/globs/match-sub-dir-files/shoes/shoe.model';
import TeamGlob from '../../models/globs/match-sub-dir-files/teams/team.model';
import PlayerDir from '../../models/globs/match-dir-only/PlayerDir';
import TeamDir from '../../models/globs/match-dir-only/TeamDir';
import ShoeDir from '../../models/globs/match-dir-only/ShoeDir';
import { Table } from '../../../src/model/table/table';
import { Match } from '../../models/exports/custom-match/match.model';
import { Model, Sequelize } from '../../../src';
import { Op } from 'sequelize';
import { join } from 'path';
import { AddressDir } from '../../models/globs/match-files/AddressDir';
import { UserDir } from '../../models/globs/match-files/UserDir';

describe('sequelize', () => {
  let sequelize: Sequelize;

  beforeEach(() => {
    sequelize = createSequelize(false);
  });

  afterEach(() => {
    sequelize.close();
  });

  const connectionUri = 'sqlite://root@localhost/__';

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
      operatorsAliases: Op,
      database: db,
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      logging: !('DISABLE_LOGGING' in process.env),
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
    const sequelizeUri = new Sequelize(connectionUri, {
      operatorsAliases: Op,
      storage: ':memory:',
      logging: !('DISABLE_LOGGING' in process.env),
      pool: { max: 8, min: 0 },
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
        .that.have.property('pool')
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
    describe('when created with config object', () => {
      const DEFINE_OPTIONS = {
        timestamps: true,
        underscored: true,
      };
      const sequelizeFromUriObject = createSequelize(false, {
        timestamps: true,
        underscored: true,
      });

      it('should have define options', () => {
        expect(sequelizeFromUriObject)
          .to.have.property('options')
          .that.has.property('define')
          .that.eqls(DEFINE_OPTIONS);
      });

      it('should set define options for models', () => {
        @Table
        class User extends Model {}

        sequelizeFromUriObject.addModels([User]);

        Object.keys(DEFINE_OPTIONS).forEach((key) => {
          expect(User).to.have.property('options').that.have.property(key, DEFINE_OPTIONS[key]);
        });
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

        const gamer = Gamer.build({ nickname: 'the_gamer' });

        expect(gamer.nickname).to.equal('the_gamer');
      });
    });

    describe('named exported models', () => {
      it('should work as expected', () => {
        sequelize.addModels([__dirname + '/../../models/exports/']);

        expect(() => Game.build({})).not.to.throw;

        const game = Game.build({ title: 'Commander Keen' });

        expect(game.title).to.equal('Commander Keen');
      });
    });

    describe('custom model-path matching', () => {
      it('should work as expected', () => {
        sequelize.addModels(
          [__dirname + '/../../models/exports/custom-match'],
          (filename, member) => {
            const modelStripped = filename.substring(0, filename.indexOf('.model'));
            return modelStripped === member.toLowerCase();
          }
        );

        expect(() => Match.build({})).not.to.throw;

        const custom = Match.build({ title: 'Commander Keen' });

        expect(custom.title).to.equal('Commander Keen');
      });
    });

    describe('definition files', () => {
      it('should not load in definition files', () => {
        sequelize.addModels([__dirname + '/../../models/exports/']);

        expect(() => Game.build({})).not.to.throw;

        expect(Object.keys(sequelize['models']).length).to.equal(2);
      });
    });
  });

  describe('model', () => {
    it('should make class references of loaded models available', () => {
      sequelize.addModels([__dirname + '/../../models/exports/']);

      expect(sequelize['models']).to.have.property('Game', Game);
      expect(sequelize['models']).to.have.property('Gamer', Gamer);
    });
  });

  describe('modelMatch', () => {
    it('should load classes using custom model matching', () => {
      const sequelizeModelMatch = createSequelize({
        modelPaths: [__dirname + '/../../models/exports/custom-match'],
        modelMatch: (filename, member) => {
          const modelStripped = filename.substring(0, filename.indexOf('.model'));
          return modelStripped === member.toLowerCase();
        },
      });

      expect(sequelizeModelMatch['models']).to.have.property('Match', Match);
    });
  });

  describe('Add model references', () => {
    it('should load models from constructor references', () => {
      @Table
      class Test extends Model {}

      const sequelize1 = new Sequelize({
        database: '__',
        dialect: 'sqlite',
        storage: ':memory:',
        logging: !('DISABLE_LOGGING' in process.env),
        models: [Test],
      });

      expect(sequelize1['models']).to.have.property('Test', Test);
    });
    it('should load models from references passed to addModels', () => {
      @Table
      class Test extends Model {}

      const sequelize1 = new Sequelize({
        database: '__',
        dialect: 'sqlite',
        storage: ':memory:',
        logging: !('DISABLE_LOGGING' in process.env),
      });
      sequelize1.addModels([Test]);

      expect(sequelize1['models']).to.have.property('Test', Test);
    });
  });

  describe('Add models as glob and dir', () => {
    it('should load classes from subfolders matching glob criteria', () => {
      const db = '__';
      const sequelizeGlob = new Sequelize({
        operatorsAliases: Op,
        database: db,
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',
        logging: !('DISABLE_LOGGING' in process.env),
        models: [__dirname + '/../../models/globs/match-sub-dir-files/**/*.model.ts'],
      });

      expect(sequelizeGlob['models']).to.have.property('PlayerGlob', PlayerGlob);
      expect(sequelizeGlob['models']).to.have.property('TeamGlob', TeamGlob);
      expect(sequelizeGlob['models']).to.have.property('ShoeGlob', ShoeGlob);
    });

    it('should load classes from folders', () => {
      const db = '__';
      const sequelizeFolder = new Sequelize({
        operatorsAliases: Op,
        database: db,
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',
        logging: !('DISABLE_LOGGING' in process.env),
        models: [__dirname + '/../../models/globs/match-dir-only'],
      });

      expect(sequelizeFolder['models']).to.have.property('PlayerDir', PlayerDir);
      expect(sequelizeFolder['models']).to.have.property('TeamDir', TeamDir);
      expect(sequelizeFolder['models']).to.have.property('ShoeDir', ShoeDir);
    });

    it('should load exact files', () => {
      const db = '__';
      const sequelizeFolder = new Sequelize({
        operatorsAliases: Op,
        database: db,
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',
        logging: !('DISABLE_LOGGING' in process.env),
        models: ['AddressDir.ts', 'UserDir.ts'].map((file) =>
          join(__dirname, '/../../models/globs/match-files', file)
        ),
      });

      expect(sequelizeFolder['models']).to.have.property('AddressDir', AddressDir);
      expect(sequelizeFolder['models']).to.have.property('UserDir', UserDir);
    });

    it('should load classes from folders and from glob', () => {
      const db = '__';
      const sequelizeGlobFolder = new Sequelize({
        operatorsAliases: Op,
        database: db,
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',
        logging: !('DISABLE_LOGGING' in process.env),
        modelPaths: [
          __dirname + '/../../models/globs/match-dir-only',
          __dirname + '/../../models/globs/match-sub-dir-files/**/*.model.ts',
        ],
      });

      expect(sequelizeGlobFolder['models']).to.have.property('PlayerDir', PlayerDir);
      expect(sequelizeGlobFolder['models']).to.have.property('TeamDir', TeamDir);
      expect(sequelizeGlobFolder['models']).to.have.property('ShoeDir', ShoeDir);
      expect(sequelizeGlobFolder['models']).to.have.property('PlayerGlob', PlayerGlob);
      expect(sequelizeGlobFolder['models']).to.have.property('TeamGlob', TeamGlob);
      expect(sequelizeGlobFolder['models']).to.have.property('ShoeGlob', ShoeGlob);
    });
  });
});
