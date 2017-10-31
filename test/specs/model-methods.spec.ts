import {expect} from 'chai';
import * as Promise from 'bluebird';
import {Model, Table, Column} from "../../index";
import {createSequelize} from "../utils/sequelize";

describe('model-methods', () => {

  const sequelize = createSequelize();

  @Table
  class User777 extends Model<User777> {

    @Column
    firstName: string;

    @Column
    lastName: string;

    static createDemoUser(): User777 {

      return new User777({firstName: 'Peter', lastName: 'Parker'});
    }

    static findDemoUser(): Promise<User777> {

      return this.findOne<User777>({where: {firstName: 'Peter', lastName: 'Parker'}});
    }
  }

  sequelize.addModels([User777]);

  beforeEach(() => sequelize.sync({force: true}));

  it('should work as expected', () => {

    const user = User777.createDemoUser();

    expect(user).to.be.an.instanceOf(User777);

    return user
      .save()
      .then(() => User777.findDemoUser())
      .then(_user => expect(_user.equals(user)).to.be.true)
    ;
  });

});
