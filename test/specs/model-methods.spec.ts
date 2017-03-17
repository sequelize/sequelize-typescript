import {expect} from 'chai';
import * as Promise from 'bluebird';
import {Model, Table, Column} from "../../index";
import {createSequelize} from "../utils/sequelize";

describe('model-methods', () => {

  const sequelize = createSequelize();

  @Table
  class User extends Model<User> {

    @Column
    firstName: string;

    @Column
    lastName: string;

    static createDemoUser(): User {

      return new User({firstName: 'Peter', lastName: 'Parker'});
    }

    static findDemoUser(): Promise<User> {

      return this.findOne<User>({where: {firstName: 'Peter', lastName: 'Parker'}});
    }
  }

  sequelize.addModels([User]);

  beforeEach(() => sequelize.sync({force: true}));

  it('should work as expected', () => {

    const user = User.createDemoUser();

    expect(user).to.be.an.instanceOf(User);

    return user
      .save()
      .then(() => User.findDemoUser())
      .then(_user => expect(_user.equals(user)).to.be.true)
    ;
  });

});
