import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {Table} from '../../../lib/model/annotations/Table';
import {BelongsTo} from '../../../lib/associations/annotations/BelongsTo';
import {Model} from '../../../lib/model/models/Model';
import {createSequelize} from '../../utils/sequelize';

use(chaiAsPromised);

// tslint:disable:max-classes-per-file
describe('BelongsTo', () => {

  const as = 'parent';
  const sequelize = createSequelize(false);

  @Table
  class Team extends Model<Team> {}

  @Table
  class Player extends Model<Player> {

    @BelongsTo(() => Team, {as, foreignKey: 'teamId'})
    team: Team;
  }

  sequelize.addModels([Team, Player]);

  it('should pass as options to sequelize association', () => {
    expect(Player['associations']).to.have.property(as);
  });

  it('should throw due to missing foreignKey', () => {
    const _sequelize = createSequelize(false);

    @Table
    class Team extends Model<Team> {}

    @Table
    class Player extends Model<Player> {
      @BelongsTo(() => Team)
      team: Team;
    }

    expect(() => _sequelize.addModels([Team, Player])).to.throw(/Foreign key for "\w+" is missing on "\w+"./);
  });

});
