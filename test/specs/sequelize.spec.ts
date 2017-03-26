import {expect} from 'chai';
import {createSequelize} from "../utils/sequelize";
import {Game} from "../models/exports/Game";
import Gamer from "../models/exports/gamer.model";

describe('sequelize', () => {

  const sequelize = createSequelize(false);

  describe('addModels', () => {

    it('should not throw', () => {

      expect(() => sequelize.addModels([__dirname + '/../models/exports/'])).not.to.throw();
    });

    it('should throw', () => {

      expect(() => sequelize.addModels([__dirname + '/../models/exports/throws'])).to.throw();
    });

    describe('default exported models', () => {

      it('should work as expected', () => {

        sequelize.addModels([__dirname + '/../models/exports/']);

        expect(() => Gamer.build({})).not.to.throw;

        const gamer = Gamer.build<Gamer>({nickname: 'the_gamer'});

        expect(gamer.nickname).to.equal('the_gamer');
      });

    });

    describe('named exported models', () => {

      it('should work as expected', () => {

        sequelize.addModels([__dirname + '/../models/exports/']);

        expect(() => Game.build({})).not.to.throw;

        const game = Game.build<Game>({title: 'Commander Keen'});

        expect(game.title).to.equal('Commander Keen');
      });

    });

  });

});
