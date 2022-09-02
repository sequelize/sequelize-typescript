import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Table } from '../../../src/model/table/table';
import { BelongsTo } from '../../../src/associations/belongs-to/belongs-to';
import { Model } from '../../../src/model/model/model';
import { createSequelize } from '../../utils/sequelize';

use(chaiAsPromised);

describe('BelongsTo', () => {
  const as = 'parent';
  const sequelize = createSequelize(false);

  @Table
  class Team extends Model {}

  @Table
  class Rank extends Model {}

  @Table
  class Player extends Model {
    @BelongsTo(() => Team, { as, foreignKey: 'teamId' })
    team: Team;

    @BelongsTo(() => Rank, { as: undefined, foreignKey: 'rankId' })
    Rank: Rank;
  }

  sequelize.addModels([Team, Player, Rank]);

  it('should pass as options to sequelize association', () => {
    expect(Player['associations']).to.have.property(as);
  });

  it('should use association model name if passed undefined for "as"', () => {
    expect(Player['associations']).to.have.property('Rank');
  });

  it('should throw due to missing foreignKey', () => {
    const _sequelize = createSequelize(false);

    @Table
    class Team extends Model {}

    @Table
    class Player extends Model {
      @BelongsTo(() => Team)
      team: Team;
    }

    expect(() => _sequelize.addModels([Team, Player])).to.throw(
      /Foreign key for "\w+" is missing on "\w+"./
    );
  });
});
