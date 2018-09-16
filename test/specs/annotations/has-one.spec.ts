import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Table} from '../../../lib/model/table/table';
import {Model} from '../../../lib/model/model/model';
import {createSequelize} from '../../utils/sequelize';
import {HasOne} from '../../../lib/associations/has/has-one';

use(chaiAsPromised);

// tslint:disable:max-classes-per-file
describe('HasOne', () => {

  const as = 'baby';
  const sequelize = createSequelize(false);

  @Table
  class Player extends Model<Player> {}

  @Table
  class Team extends Model<Team> {

    @HasOne(() => Player, {
      as,
      foreignKey: 'teamId'
    })
    player: Player;
  }


  sequelize.addModels([Team, Player]);

  it('should pass as options to sequelize association', () => {
    expect(Team['associations']).to.have.property(as);
  });

});
