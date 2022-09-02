import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Table } from '../../../src/model/table/table';
import { Model } from '../../../src/model/model/model';
import { createSequelize } from '../../utils/sequelize';
import { BelongsToMany } from '../../../src/associations/belongs-to-many/belongs-to-many';

use(chaiAsPromised);

describe('BelongsToMany', () => {
  const as = 'manyTeams';
  const sequelize = createSequelize(false);

  @Table
  class Team extends Model {}

  @Table
  class Rank extends Model {}

  @Table
  class Player extends Model {
    @BelongsToMany(() => Team, {
      as,
      through: 'TeamPlayer',
      foreignKey: 'playerId',
      otherKey: 'teamId',
    })
    teams: Team[];

    @BelongsToMany(() => Rank, {
      as: undefined,
      through: 'RankPlayer',
      foreignKey: 'playerId',
      otherKey: 'rankId',
    })
    Ranks: Rank[];
  }

  sequelize.addModels([Team, Player, Rank]);

  it('should pass as options to sequelize association', () => {
    expect(Player['associations']).to.have.property(as);
  });

  it('should use association model name if passed undefined for "as"', () => {
    expect(Player['associations']).to.have.property('Ranks');
  });
});
