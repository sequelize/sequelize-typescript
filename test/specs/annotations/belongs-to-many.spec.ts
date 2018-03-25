import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Table} from '../../../lib/model/annotations/Table';
import {Model} from '../../../lib/model/models/Model';
import {createSequelize} from '../../utils/sequelize';
import {BelongsToMany} from '../../../lib/associations/annotations/BelongsToMany';

use(chaiAsPromised);

// tslint:disable:max-classes-per-file
describe('BelongsToMany', () => {

  const as = 'manyTeams';
  const sequelize = createSequelize(false);

  @Table
  class Team extends Model<Team> {}

  @Table
  class Player extends Model<Player> {

    @BelongsToMany(() => Team, {
      as,
      through: 'TeamPlayer',
      foreignKey: 'playerId',
      otherKey: 'teamId',
    })
    teams: Team[];
  }

  sequelize.addModels([Team, Player]);

  it('should pass as options to sequelize association', () => {
    expect(Player['associations']).to.have.property(as);
  });

});
