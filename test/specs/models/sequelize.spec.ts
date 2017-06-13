import {expect} from 'chai';
import {createSequelize} from "../../utils/sequelize";
import {Game} from "../../models/exports/Game";
import Gamer from "../../models/exports/gamer.model";
import {Sequelize} from "../../../lib/models/Sequelize";

describe('sequelize', () => {

  const sequelize = createSequelize(false);

  describe('constructor', () => {

    it('should equal Sequelize class', () => {
      expect(sequelize.constructor).to.equal(Sequelize);
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
