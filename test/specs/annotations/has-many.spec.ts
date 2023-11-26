import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Table } from '../../../src/model/table/table';
import { Model } from '../../../src/model/model/model';
import { createSequelize } from '../../utils/sequelize';
import { HasMany } from '../../../src/associations/has/has-many';

use(chaiAsPromised);

describe('HasMany', () => {
  const as = 'babies';
  const sequelize = createSequelize(false);

  @Table
  class Player extends Model {}

  @Table
  class Rank extends Model {}

  @Table
  class Team extends Model {
    @HasMany(() => Player, {
      as,
      foreignKey: 'teamId',
    })
    players: Player[];

    @HasMany(() => Rank, {
      as: undefined,
      foreignKey: 'rankId',
    })
    Ranks: Rank[];
  }

  sequelize.addModels([Team, Player, Rank]);

  it('should pass as options to sequelize association', () => {
    expect(Team['associations']).to.have.property(as);
  });

  it('should use association model name if passed undefined for "as"', () => {
    expect(Team['associations']).to.have.property('Ranks');
  });
});
