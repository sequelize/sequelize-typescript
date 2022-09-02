import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Table } from '../../../src/model/table/table';
import { Model } from '../../../src/model/model/model';
import { createSequelize } from '../../utils/sequelize';
import { HasOne } from '../../../src/associations/has/has-one';

use(chaiAsPromised);

describe('HasOne', () => {
  const as = 'baby';
  const sequelize = createSequelize(false);

  @Table
  class Player extends Model {}

  @Table
  class Rank extends Model {}

  @Table
  class Team extends Model {
    @HasOne(() => Player, {
      as,
      foreignKey: 'teamId',
    })
    player: Player;

    @HasOne(() => Rank, {
      as: undefined,
      foreignKey: 'rankId',
    })
    Rank: Rank;
  }

  sequelize.addModels([Team, Player, Rank]);

  it('should pass as options to sequelize association', () => {
    expect(Team['associations']).to.have.property(as);
  });

  it('should use association model name if passed undefined for "as"', () => {
    expect(Player['associations']).to.have.property('Rank');
  });
});
