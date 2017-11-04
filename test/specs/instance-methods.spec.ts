import {expect} from 'chai';
import * as Promise from 'bluebird';
import {Model, Table, Column} from "../../index";
import {createSequelize} from "../utils/sequelize";

describe('instance-methods', () => {

  const sequelize = createSequelize();

  @Table
  class User extends Model<User> {

    @Column
    firstName: string;

    @Column
    lastName: string;

    getFullName(): string {

      return this.firstName + ' ' + this.lastName;
    }

    setFullName(name: string): void {

      const split = name.split(' ');

      this.lastName = split.pop();
      this.firstName = split.join(' ');
    }
  }

  sequelize.addModels([User]);

  beforeEach(() => sequelize.sync({force: true}));

  const suites: Array<[string, () => Promise<User>]> = [
    ['build', () => Promise.resolve<User>(User.build({firstName: 'Peter', lastName: 'Parker'}))],
    ['new', () => Promise.resolve<User>(new User({firstName: 'Peter', lastName: 'Parker'}))],
    ['create', () => (User.create({firstName: 'Peter', lastName: 'Parker'}))],
  ];

  suites.forEach(([name, create]) => {

    describe(name, () => {

      let user;

      beforeEach(() => create().then(_user => user = _user));

      it('should have access to functions of prototype', () => {

        Object
          .keys(User.prototype)
          .forEach(key => {

            expect(user).to.have.property(key, User.prototype[key]);
          });
      });

      describe('"get" function', () => {

        it('should return appropriate value', () => {

          expect(user.getFullName()).to.equal(user.firstName + ' ' + user.lastName);
        });
      });

      describe('"set" function', () => {

        const firstName = 'Tony';
        const lastName = 'Stark';
        const fullName = firstName + ' ' + lastName;

        it('should set specified value to instance', () => {

          user.setFullName(fullName);

          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
        });

        it('should store set value', () => {

          user.setFullName(fullName);

          return user
            .save()
            .then(() => User.findById(user.id))
            .then(_user => {

              expect(_user.firstName).to.equal(firstName);
              expect(_user.lastName).to.equal(lastName);
            })
            ;
        });
      });
    });
  });

});
