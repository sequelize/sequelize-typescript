import { expect } from 'chai';
import { Model, Table, Column } from '../../src';
import { createSequelize } from '../utils/sequelize';

describe('model-methods', () => {
  let sequelize;

  @Table
  class User extends Model {
    @Column
    firstName: string;

    @Column
    lastName: string;

    static createDemoUser(): User {
      return new User({ firstName: 'Peter', lastName: 'Parker' });
    }

    static findDemoUser(): Promise<User> {
      return this.findOne({ where: { firstName: 'Peter', lastName: 'Parker' } });
    }
  }

  before(() => {
    sequelize = createSequelize();
    sequelize.addModels([User]);
  });

  beforeEach(() => sequelize.sync({ force: true }));

  it('should work as expected', () => {
    const user = User.createDemoUser();

    expect(user).to.be.an.instanceOf(User);

    return user
      .save()
      .then(() => User.findDemoUser())
      .then((_user) => expect(_user.equals(user)).to.be.true);
  });
});
