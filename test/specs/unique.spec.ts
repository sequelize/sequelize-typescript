import {expect} from 'chai';
import {Table} from '../../lib/annotations/Table';
import {Model} from '../../lib/models/Model';
import {Unique} from '../../lib/annotations/Unique';
import {Column} from '../../lib/annotations/Column';
import {Sequelize} from '../../lib/models/Sequelize';
import {getAttributes} from '../../lib/services/models';

describe('unique decorator', () => {

  let sequelize;
  let User;

  before(() => {
    @Table
    class UserModel extends Model<UserModel> {
      @Unique('test') @Column name: string;
      @Unique @Column key: string;
    }
    User = UserModel;

    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: !('SEQ_SILENT' in process.env),
    });
    sequelize.addModels([User]);
  });

  it('should set advanced unique options', () => {
    const attributes = getAttributes(User.prototype);
    expect(attributes).to.have.property('name')
      .which.has.property('unique', 'test');
  });

  it('should enable unique options', () => {
    const attributes = getAttributes(User.prototype);
    expect(attributes).to.have.property('key')
      .which.has.property('unique', true);
  });

});
