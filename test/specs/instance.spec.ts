import {expect, use} from 'chai';
import {useFakeTimers} from 'sinon';
import chaiDatetime = require('chai-datetime');
import * as chaiAsPromised from 'chai-as-promised';
import * as validateUUID from 'uuid-validate';
import {createSequelize} from "../utils/sequelize";
import {InstanceError} from 'sequelize';
import {Sequelize} from "../../index";
import {User} from "../models/User";
import {TimeStampsUser} from "../models/TimeStampsUser";
import {Book} from "../models/Book";
import {Page} from "../models/Page";
import {Team} from "../models/Team";
import {Player} from "../models/Player";
import {Shoe} from "../models/Shoe";
import {Person} from "../models/Person";
import {Box} from "../models/Box";
import {UserWithValidation} from "../models/UserWithValidation";
import {UserWithNoAutoIncrementation} from "../models/UserWithNoAutoIncrementation";
import {UserWithCustomUpdatedAt} from "../models/UserWithCustomUpdatedAt";
import {UserWithCreatedAtButWithoutUpdatedAt} from "../models/UserWithCreatedAtButWithoutUpdatedAt";
// import {UserWithSwag} from "../models/UserWithSwag";

declare module 'sequelize' {
  class InstanceError {
  }
}

use(chaiAsPromised);
use(chaiDatetime);

/* tslint:disable:max-classes-per-file */

describe('instance', () => {

  const sequelize = createSequelize();

  beforeEach(() => sequelize.sync({force: true}));

  describe('isNewRecord', () => {

    it('returns true for non-saved objects', () => {
      const user = User.build<User>({username: 'user'});
      expect(user.id).to.be.null;
      expect(user.isNewRecord).to.be.ok;
    });

    it('returns false for saved objects', () =>
      User
        .build<User>({username: 'user'})
        .save()
        .then((user) => {
          expect(user.isNewRecord).to.not.be.ok;
        })
    );

    it('returns false for created objects', () =>
      User
        .create<User>({username: 'user'})
        .then((user: User) => {
          expect(user.id).to.not.be.null;
          expect(user.isNewRecord).to.not.be.ok;
        })
    );

    it('returns false for objects found by find method', () =>
      User
        .create({username: 'user'})
        .then(() =>
          User
            .create<User>({username: 'user'})
            .then((user) =>
              User
                .findById<User>(user.id)
                .then((_user) => {
                  expect(_user).to.not.be.null;
                  expect(_user && _user.isNewRecord).to.not.be.ok;
                })
            )
        )
    );

    it('returns false for objects found by findAll method', () => {
      const users: Array<Partial<User>> = [];

      for (let i = 0; i < 10; i++) {
        users[users.length] = {username: 'user'};
      }

      return User
        .bulkCreate(users)
        .then(() =>
          User
            .findAll<User>()
            .then((_users) => {
              _users.forEach((u) => {
                expect(u.isNewRecord).to.not.be.ok;
              });
            })
        );
    });
  });

  describe('increment', () => {

    beforeEach(() => User.create({id: 1, aNumber: 0, bNumber: 0}));

    // TODO transactions doesn't seem to work with sqlite3
    // if (sequelize['dialect']['supports']['transactions']) {
    //
    //   it('supports transactions', () =>
    //     User
    //       .findOne()
    //       .then((user: User) =>
    //         sequelize
    //           .transaction()
    //           .then(transaction =>
    //
    //             user
    //               .increment('aNumber', {by: 2, transaction})
    //               .then(() =>
    //                 User
    //                   .findAll()
    //                   .then((users1) =>
    //
    //                     User
    //                       .findAll<User>({transaction})
    //                       .then((users2) => {
    //
    //                         // expect(users1[0].aNumber).to.equal(0); TODO check
    //                         expect(users2[0].aNumber).to.equal(2);
    //                       })
    //                       .then(() => transaction.rollback())
    //                   )
    //                   .then(() => User.findAll())
    //               )
    //           )
    //       )
    //   );
    // }

    if (sequelize['dialect']['supports']['returnValues']) {

      it('supports returning', () =>
        User
          .findById<User>(1)
          .then((user1) => {

            if (user1) {
              return user1
                .increment('aNumber', {by: 2})
                .then(() => {
                  expect(user1.aNumber).to.be.equal(2);
                });
            }
          })
      );
    }

    it('supports where conditions', () =>
      User
        .findById<User>(1)
        .then((user1) => {

            if (user1) {

              return user1.increment(['aNumber'], {by: 2, where: {bNumber: 1}})
                .then(() =>
                  User
                    .findById<User>(1)
                    .then((user3) => {
                      expect(user3.aNumber).to.be.equal(0);
                    })
                );
            }
          }
        )
    );

    it('with array', () =>
      User
        .findById<User>(1)
        .then((user1) =>
          user1.increment(['aNumber'], {by: 2})
            .then(() =>
              User
                .findById<User>(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(2);
                })
            )
        )
    );

    it('with single field', () =>
      User
        .findById<User>(1)
        .then((user1) =>
          user1
            .increment('aNumber', {by: 2})
            .then(() =>
              User
                .findById<User>(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(2);
                })
            )
        )
    );

    it('with single field and no value', () =>
      User
        .findById<User>(1)
        .then((user1) =>
          user1.increment('aNumber')
            .then(() =>
              User
                .findById<User>(1)
                .then((user2) => {
                  expect(user2.aNumber).to.be.equal(1);
                })
            )
        )
    );

    it('should still work right with other concurrent updates', () =>
      User
        .findById<User>(1)
        .then((user1) =>
          // Select the user again (simulating a concurrent query)
          User
            .findById<User>(1)
            .then((user2) =>
              user2
                .updateAttributes({
                  aNumber: user2.aNumber + 1
                })
                .then(() =>
                  user1
                    .increment(['aNumber'], {by: 2})
                    .then(() =>
                      User
                        .findById<User>(1)
                        .then((user5) => {
                          expect(user5.aNumber).to.be.equal(3);
                        })
                    )
                )
            )
        )
    );

    it('should still work right with other concurrent increments', () =>
      User
        .findById<User>(1)
        .then((user1) =>
          sequelize.Promise.all([
            user1.increment(['aNumber'], {by: 2}),
            user1.increment(['aNumber'], {by: 2}),
            user1.increment(['aNumber'], {by: 2})
          ])
            .then(() =>
              User
                .findById<User>(1)
                .then((user2) => {
                  expect(user2.aNumber).to.equal(6);
                })
            )
        )
    );

    it('with key value pair', () =>
      User
        .findById<User>(1)
        .then((user1) =>
          user1
            .increment({aNumber: 1, bNumber: 2})
            .then(() =>
              User
                .findById<User>(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(1);
                  expect(user3.bNumber).to.be.equal(2);
                })
            )
        )
    );

    it('with timestamps set to true', () => {

      const clock = useFakeTimers();
      let oldDate;

      return TimeStampsUser
        .sync({force: true})
        .then(() => TimeStampsUser.create<TimeStampsUser>({aNumber: 1}))
        .then((user) => {

          oldDate = user.updatedAt;

          clock.tick(1000);

          return user.increment('aNumber', {by: 1});
        })
        .then(() => TimeStampsUser.findById<TimeStampsUser>(1))
        .then(user => {
          expect(user).to.have.property('updatedAt');
          expect(user.updatedAt).to.be.greaterThan(oldDate);
        });
    });

    it('with timestamps set to true and options.silent set to true', () => {

      let oldDate;

      return TimeStampsUser
        .sync({force: true})
        .then(() => TimeStampsUser.create<TimeStampsUser>({aNumber: 1}))
        .then((user) => {

          oldDate = user.updatedAt;

          return user.increment('aNumber', {by: 1, silent: true});
        })
        .then(() => TimeStampsUser.findById<TimeStampsUser>(1))
        .then(user => {
          expect(user).to.have.property('updatedAt');
          expect(user.updatedAt).to.eqls(oldDate);
        });
    });
  });

  describe('decrement', () => {

    // TODO transactions doesn't seem to work with sqlite3
    // if (sequelize['dialect']['supports']['transactions']) {
    //
    //   it('supports transactions', () =>
    //     User
    //       .create<User>({aNumber: 3})
    //       .then((user) =>
    //         sequelize
    //           .transaction()
    //           .then(transaction =>
    //             user
    //               .decrement('aNumber', {by: 2, transaction})
    //               .then(() =>
    //                 User
    //                   .findAll()
    //                   .then((users1) =>
    //                     User
    //                       .findAll<User>({transaction})
    //                       .then((users2) => {
    //                         // expect(users1[0].aNumber).to.equal(3); // TODO transactions does not seem to work
    //                         expect(users2[0].aNumber).to.equal(1);
    //                       })
    //                       .then(() => transaction.rollback())
    //                   )
    //               )
    //           )
    //       )
    //   );
    // }

    it('with array', () =>
      User
        .create<User>({aNumber: 0})
        .then(() => User.findById<User>(1))
        .then((user1) =>
          user1
            .decrement(['aNumber'], {by: 2})
            .then(() =>
              User
                .findById<User>(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(-2);
                })
            )
        )
    );

    it('with single field', () =>
      User
        .create<User>({aNumber: 0})
        .then(() => User.findById<User>(1))
        .then((user1) =>
          user1
            .decrement('aNumber', {by: 2})
            .then(() =>
              User
                .findById<User>(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(-2);
                })
            )
        )
    );

    it('with single field and no value', () =>
      User
        .create<User>({aNumber: 0})
        .then(() => User.findById<User>(1))
        .then((user1) =>
          user1
            .decrement('aNumber')
            .then(() =>
              User
                .findById<User>(1)
                .then((user2) => {
                  expect(user2.aNumber).to.be.equal(-1);
                })
            )
        )
    );

    it('should still work right with other concurrent updates', () =>
      User
        .create<User>({aNumber: 0})
        .then(() => User.findById<User>(1))
        .then((user1) =>
          // Select the user again (simulating a concurrent query)
          User
            .findById<User>(1)
            .then((user2) =>
              user2
                .updateAttributes({
                  aNumber: user2.aNumber + 1
                })
                .then(() =>
                  user1
                    .decrement(['aNumber'], {by: 2})
                    .then(() =>
                      User
                        .findById<User>(1)
                        .then((user5) => {
                          expect(user5.aNumber).to.be.equal(-1);
                        })
                    )
                )
            )
        )
    );

    it('should still work right with other concurrent increments', () =>
      User
        .create<User>({aNumber: 0})
        .then(() => User.findById<User>(1))
        .then((user1) =>
          sequelize.Promise.all([
            user1.decrement(['aNumber'], {by: 2}),
            user1.decrement(['aNumber'], {by: 2}),
            user1.decrement(['aNumber'], {by: 2})
          ])
            .then(() =>
              User
                .findById<User>(1)
                .then((user2) => {
                  expect(user2.aNumber).to.equal(-6);
                })
            )
        )
    );

    it('with key value pair', () =>
      User
        .create<User>({aNumber: 0, bNumber: 0})
        .then(() => User.findById<User>(1))
        .then((user1) =>
          user1
            .decrement({aNumber: 1, bNumber: 2})
            .then(() =>
              User
                .findById<User>(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(-1);
                  expect(user3.bNumber).to.be.equal(-2);
                })
            )
        )
    );

    it('with timestamps set to true', () => {

      let oldDate;
      const clock = useFakeTimers();

      return TimeStampsUser
        .sync({force: true})
        .then(() => TimeStampsUser.create<TimeStampsUser>({aNumber: 1}))
        .then((user) => {
          oldDate = user.updatedAt;

          clock.tick(1000);

          return user.decrement('aNumber', {by: 1});
        })
        .then(() => TimeStampsUser.findById<TimeStampsUser>(1))
        .then(user => {
          expect(user).to.have.property('updatedAt');
          expect(user.updatedAt).to.be.greaterThan(oldDate);
        });
    });

    it('with timestamps set to true and options.silent set to true', () => {

      let oldDate;

      return TimeStampsUser
        .sync({force: true})
        .then(() => TimeStampsUser.create<TimeStampsUser>({aNumber: 1}))
        .then((user) => {
          oldDate = user.updatedAt;
          return user.decrement('aNumber', {by: 1, silent: true});
        })
        .then(() => TimeStampsUser.findById<TimeStampsUser>(1))
        .then(user => {
          expect(user).to.have.property('updatedAt');
          expect(user.updatedAt).to.eqls(oldDate);
        });
    });

  });

  describe('reload', () => {

    // TODO transactions doesn't seem to work with sqlite3
    // if (sequelize['dialect']['supports']['transactions']) {
    //
    //   it('supports transactions', () =>
    //     User
    //       .sync({force: true})
    //       .then(() =>
    //         User
    //           .create<User>({username: 'foo'})
    //           .then((user) =>
    //             sequelize
    //               .transaction()
    //               .then((transaction) =>
    //                 User
    //                   .update<User>({username: 'bar'}, {where: {username: 'foo'}, transaction})
    //                   .then(() =>
    //                     user
    //                       .reload()
    //                       .then((user1) => {
    //                         // expect(user1.username).to.equal('foo'); // TODO transactions doesn't seem to work properly in sqlite3
    //                         return user1
    //                           .reload({transaction})
    //                           .then((user2) => {
    //                             expect(user2.username).to.equal('bar');
    //                             return transaction.rollback();
    //                           });
    //                       })
    //                   )
    //               )
    //           )
    //       )
    //   );
    // }

    it('should return a reference to the same DAO instead of creating a new one', () =>
      User
        .create<User>({username: 'John Doe'})
        .then((originalUser) =>
          originalUser
            .updateAttributes({username: 'Doe John'})
            .then(() =>
              originalUser
                .reload()
                .then((updatedUser) => {
                  expect(originalUser === updatedUser).to.be.true;
                })
            )
        )
    );

    it('should update the values on all references to the DAO', () =>
      User
        .create<User>({username: 'John Doe'})
        .then((originalUser) =>
          User
            .findById<User>(originalUser.id)
            .then((updater) =>
              updater
                .updateAttributes({username: 'Doe John'})
                .then(() => {
                  // We used a different reference when calling updateAttributes, so originalUser is now out of sync
                  expect(originalUser.username).to.equal('John Doe');
                  return originalUser.reload().then((updatedUser) => {
                    expect(originalUser.username).to.equal('Doe John');
                    expect(updatedUser.username).to.equal('Doe John');
                  });
                })
            )
        )
    );

    it('should support updating a subset of attributes', () =>
      User
        .create<User>({aNumber: 1, bNumber: 1})
        .tap((user) => User.update<User>({bNumber: 2}, {where: {id: user.get('id')}}))
        .then((user) => user.reload({attributes: ['bNumber']}))
        .then((user) => {
          expect(user.get('aNumber')).to.equal(1);
          expect(user.get('bNumber')).to.equal(2);
        })
    );

    it('should update read only attributes as well (updatedAt)', () => {
      let _originalUser;
      let originallyUpdatedAt;
      let _updatedUser;

      return TimeStampsUser
        .create<TimeStampsUser>({username: 'John Doe'})
        .then((originalUser) => {
          originallyUpdatedAt = originalUser.updatedAt;
          _originalUser = originalUser;

          return TimeStampsUser.findById<TimeStampsUser>(originalUser.id);
        })
        .then((updater) => updater.updateAttributes({username: 'Doe John'}))
        .then((updatedUser) => {
          _updatedUser = updatedUser;
          _originalUser.reload();
        })
        .then(() => {
          expect(_originalUser.updatedAt).to.be.least(originallyUpdatedAt);
          expect(_updatedUser.updatedAt).to.be.least(originallyUpdatedAt);
        });
    });

    it('should update the associations as well', () =>
      Book
        .sync({force: true})
        .then(() => Page.sync({force: true}))
        .then(() => Book.create<Book>({title: 'A very old book'}))
        .then((book) =>
          Page
            .create<Page>({content: 'om nom nom'})
            .then((page) =>
              book
                ['setPages']([page]) // todo
                .then(() => Book.findOne({where: {id: book.id}, include: [Page]}))
                .then((leBook: Book) =>
                  page
                    .updateAttributes({content: 'something totally different'})
                    .then((_page: Page) => {
                      expect(leBook.pages.length).to.equal(1);
                      expect(leBook.pages[0].content).to.equal('om nom nom');
                      expect(_page.content).to.equal('something totally different');

                      return leBook
                        .reload()
                        .then((_leBook: any) => {
                          expect(_leBook.pages.length).to.equal(1);
                          expect(_leBook.pages[0].content).to.equal('something totally different');
                          expect(_page.content).to.equal('something totally different');
                        });
                    })
                )
            )
        )
    );

    it('should update internal options of the instance', () =>
      Book
        .sync({force: true})
        .then(() => Page.sync({force: true}))
        .then(() => Book.create<Book>({title: 'A very old book'}))
        .then((book) =>
          Page
            .create<Page>()
            .then((page) =>
              book['setPages']([page]) // todo
                .then(() =>
                  Book
                    .findOne<Book>({where: {id: book.id}})
                    .then((leBook) => {
                      return leBook.reload({include: [Page]})
                        .then((_leBook: Book) => {
                          expect(_leBook.pages.length).to.equal(1);
                          expect(_leBook.get({plain: true}).pages.length).to.equal(1);
                        });
                    })
                )
            )
        )
    );

    it('should return an error when reload fails', () =>
      User
        .create<User>({username: 'John Doe'})
        .then((user) =>
          user
            .destroy()
            .then(() => {
              return expect(user.reload()).to.be.rejectedWith(
                InstanceError,
                'Instance could not be reloaded because it does not exist anymore (find call returned null)'
              );
            })
        )
    );

    it('should set an association to null after deletion, 1-1', () =>
      Shoe
        .create({
          brand: 'the brand',
          player: {
            name: 'the player'
          }
        }, {include: [Player]})
        .then((shoe: Shoe) =>
          Player
            .findOne({
              where: {id: shoe.player.id},
              include: [Shoe]
            })
            .then((lePlayer: Player) => {
              expect(lePlayer.shoe).not.to.be.null;
              return lePlayer.shoe.destroy().return(lePlayer);
            })
            .then((lePlayer) => lePlayer.reload() as any)
            .then((lePlayer: Player) => {
              expect(lePlayer.shoe).to.be.null;
            })
        )
    );

    it('should set an association to empty after all deletion, 1-N', () =>
      Team
        .create<Team>({
          name: 'the team',
          players: [{
            name: 'the player1'
          }, {
            name: 'the player2'
          }]
        }, {include: [Player]})
        .then((team) =>
          Team
            .findOne({
              where: {id: team.id},
              include: [Player]
            })
            .then((leTeam: Team) => {
              expect(leTeam.players).not.to.be.empty;

              return leTeam.players[1]
                .destroy()
                .then(() => {
                  return leTeam.players[0].destroy();
                }).return(leTeam);
            })
            .then((leTeam) => leTeam.reload() as any)
            .then((leTeam: Team) => {
              expect(leTeam.players).to.be.empty;
            })
        )
    );

    it('should update the associations after one element deleted', () =>
      Team
        .create<Team, {name: string; players: Array<{name: string}>}>({
          name: 'the team',
          players: [{
            name: 'the player1'
          }, {
            name: 'the player2'
          }]
        }, {include: [Player]})
        .then((team) =>
          Team
            .findOne<Team>({
              where: {id: team.id},
              include: [Player]
            })
            .then((leTeam: Team) => {
              expect(leTeam.players).to.have.length(2);
              return leTeam.players[0].destroy().then(() => leTeam as Team);
            })
            .then((leTeam) => leTeam.reload() as any)
            .then((leTeam: Team) => {
              expect(leTeam.players).to.have.length(1);
            })
        )
    );
  });

  describe('default values', () => {

    describe('uuid', () => {

      it('should store a string in uuidv1 and uuidv4', () => {
        const user = User.build<User>({username: 'a user'});
        expect(user.uuidv1).to.be.a('string');
        expect(user.uuidv4).to.be.a('string');
      });

      it('should store a string of length 36 in uuidv1 and uuidv4', () => {
        const user = User.build<User>({username: 'a user'});
        expect(user.uuidv1).to.have.length(36);
        expect(user.uuidv4).to.have.length(36);
      });

      it('should store a valid uuid in uuidv1 and uuidv4 that conforms to the UUID v1 and v4 specifications', () => {
        const user = User.build<User>({username: 'a user'});
        expect(validateUUID(user.uuidv1, 1)).to.be.true;
        expect(validateUUID(user.uuidv4, 4)).to.be.true;
      });

      it('should store a valid uuid if the field is a primary key named id', () => {
        const person = Person.build<Person>({});
        expect(person.id).to.be.ok;
        expect(person.id).to.have.length(36);
      });

    });

    describe('current date', () => {

      it('should store a date in touchedAt', () => {
        const user = User.build<User>({username: 'a user'});
        expect(user.touchedAt).to.be.instanceof(Date);
      });

      it('should store the current date in touchedAt', () => {
        const clock = useFakeTimers();
        clock.tick(5000);
        const user = User.build<User>({username: 'a user'});
        clock.restore();
        expect(+user.touchedAt).to.be.equal(5000);
      });
    });

    describe('allowNull date', () => {

      it('should be just "null" and not Date with Invalid Date', () =>
        User
          .build<User>({username: 'a user'})
          .save()
          .then(() =>
            User
              .findOne<User>({where: {username: 'a user'}})
              .then((user) => {
                expect(user.dateAllowNullTrue).to.be.null;
              })
          )
      );

      it('should be the same valid date when saving the date', () => {

        const date = new Date();
        return User
          .build<User>({username: 'a user', dateAllowNullTrue: date})
          .save()
          .then(() =>
            User
              .findOne<User>({where: {username: 'a user'}})
              .then((user) => {
                expect(user.dateAllowNullTrue.toString()).to.equal(date.toString());
              })
          );
      });
    });

    describe('super user boolean', () => {

      it('should default to false', () =>
        User
          .build<User>({
            username: 'a user'
          })
          .save()
          .then(() =>
            User.findOne<User>({
              where: {
                username: 'a user'
              }
            }))
          .then((user) => {
            expect(user.isSuperUser).to.be.false;
          })
      );

      it('should override default when given truthy boolean', () =>
        User
          .build<User>({
            username: 'a user',
            isSuperUser: true
          })
          .save()
          .then(() => {
            User.findOne<User>({
              where: {
                username: 'a user'
              }
            })
              .then((user) => {
                expect(user.isSuperUser).to.be.true;
              });
          })
      );

      it('should override default when given truthy boolean-string ("true")', () =>
        User
          .build<User>({
            username: 'a user',
            isSuperUser: "true" as any // by intention
          })
          .save()
          .then(() => {
            User.findOne<User>({
              where: {
                username: 'a user'
              }
            })
              .then((user) => {
                expect(user.isSuperUser).to.be.true;
              });
          })
      );

      it('should override default when given truthy boolean-int (1)', () =>
        User
          .build<User>({
            username: 'a user',
            isSuperUser: 1
          })
          .save()
          .then(() => {
            User.findOne<User>({
              where: {
                username: 'a user'
              }
            })
              .then((user) => {
                expect(user.isSuperUser).to.be.true;
              });
          })
      );

      it('should throw error when given value of incorrect type', () => {
        let callCount = 0;

        return User
          .build<User>({
            username: 'a user',
            isSuperUser: "INCORRECT_VALUE_TYPE" as any // incorrect value by intention
          })
          .save()
          .then(() => callCount += 1)
          .catch((err) => {
            expect(callCount).to.equal(0);
            expect(err).to.exist;
            expect(err.message).to.exist;
          });
      });
    });
  });

  describe('complete', () => {

    it('gets triggered if an error occurs', () =>
      User
        .findOne({where: ['asdasdasd']})
        .catch((err) => {
          expect(err).to.exist;
          expect(err.message).to.exist;
        })
    );

    it('gets triggered if everything was ok', () =>
      User
        .count()
        .then((result) => {
          expect(result).to.exist;
        })
    );
  });

  describe('save', () => {

    // TODO transactions doesn't seem to work with sqlite3
    // if (sequelize['dialect']['supports']['transactions']) {
    //
    //   it('supports transactions', () =>
    //     User
    //       .sync({force: true})
    //       .then(() => sequelize.transaction())
    //       .then((transaction) =>
    //         User
    //           .build<User>({username: 'foo'})
    //           .save({transaction})
    //           .then(() => User.count())
    //           .then((count1) =>
    //             User
    //               .count({transaction})
    //               .then((count2) => {
    //
    //                 // expect(count1).to.equal(0); // TODO transaction => sqlite3
    //                 expect(count2).to.equal(1);
    //                 return transaction.rollback();
    //               })
    //           )
    //       )
    //   );
    // }

    it('only updates fields in passed array', () => {
      const date = new Date(1990, 1, 1);

      return User
        .create<User>({
          username: 'foo',
          touchedAt: new Date()
        })
        .then((user) => {
          user.username = 'fizz';
          user.touchedAt = date;

          return user
            .save({fields: ['username']})
            // re-select user
            .then(() => User.findById<User>(user.id))
            .then((user2) => {
              // name should have changed
              expect(user2.username).to.equal('fizz');
              // bio should be unchanged
              expect(user2).to.have.property('birthDate');
              expect(user2.birthDate).not.to.equal(date);
            });

        });
    });

    it('should work on a model with an attribute named length', () =>
      Box
        .sync({force: true})
        .then(() => Box.create({length: 1, width: 2, height: 3}))
        .then((box: Box) => box.update({length: 4, width: 5, height: 6}))
        .then(() => Box.findOne({}))
        .then((box: Box) => {
          expect(box.get('length')).to.equal(4);
          expect(box.get('width')).to.equal(5);
          expect(box.get('height')).to.equal(6);
        })
    );

    it('only validates fields in passed array', () =>
      User
        .build<User>({
          validateTest: 'cake', // invalid, but not saved
          validateCustom: '1'
        })
        .save({
          fields: ['validateCustom']
        })
    );

    describe('hooks', () => {
      it('should update attributes added in hooks when default fields are used', () => {

        User
          .beforeUpdate((instance) => {
            instance.set('email', 'B');
          });

        return User
          .sync({force: true})
          .then(() => User.create<User>({name: 'A', bio: 'A', email: 'A'}))
          .then((user) => user.set({name: 'B', bio: 'B'}).save())
          .then(() => User.findOne<User>({}))
          .then((user) => {
            expect(user.get('name')).to.equal('B');
            expect(user.get('bio')).to.equal('B');
            expect(user.get('email')).to.equal('B');
          });
      });

      it('should update attributes changed in hooks when default fields are used', () => {

        User.beforeUpdate((instance) => {
          instance.set('email', 'C');
        });

        return User
          .sync({force: true})
          .then(() => User.create<User>({name: 'A', bio: 'A', email: 'A'}))
          .then((user: User) => user.set({name: 'B', bio: 'B', email: 'B'}).save())
          .then(() => User.findOne<User>({}))
          .then((user) => {
            expect(user.get('name')).to.equal('B');
            expect(user.get('bio')).to.equal('B');
            expect(user.get('email')).to.equal('C');
          });
      });

      it('should validate attributes added in hooks when default fields are used', () => {
        UserWithValidation.beforeUpdate((instance) => {
          instance.set('email', 'B');
        });

        return UserWithValidation
          .sync({force: true})
          .then(() => UserWithValidation.create<UserWithValidation>({
            name: 'A',
            bio: 'A',
            email: 'valid.email@gmail.com'
          }))
          .then((user) =>
            expect(user.set({
              name: 'B'
            }).save()).to.be.rejectedWith(Sequelize.ValidationError)
          )
          .then(() => UserWithValidation.findOne<UserWithValidation>({}))
          .then((user) => {
            expect(user.get('email')).to.equal('valid.email@gmail.com');
          });
      });

      it('should validate attributes changed in hooks when default fields are used', () => {

        UserWithValidation.beforeUpdate((instance) => {
          instance.set('email', 'B');
        });

        return UserWithValidation
          .sync({force: true})
          .then(() => UserWithValidation.create<UserWithValidation>({
            name: 'A',
            bio: 'A',
            email: 'valid.email@gmail.com'
          }))
          .then((user) =>
            expect(user.set({
              name: 'B',
              email: 'still.valid.email@gmail.com'
            }).save()).to.be.rejectedWith(Sequelize.ValidationError)
          )
          .then(() => UserWithValidation.findOne<UserWithValidation>({}))
          .then((user) => {
            expect(user.get('email')).to.equal('valid.email@gmail.com');
          });
      });

    });

    it('stores an entry in the database', () => {
      const username = 'user';
      const user = User.build<User>({
        username,
        touchedAt: new Date(1984, 8, 23)
      });

      return User.findAll()
        .then((users) => {
          expect(users).to.have.length(0);

          return user.save();
        })
        .then(() => User.findAll<User>())
        .then((users) => {

          expect(users).to.have.length(1);
          expect(users[0].username).to.equal(username);
          expect(users[0].touchedAt).to.be.instanceof(Date);
          expect(users[0].touchedAt.toString()).to.equal(new Date(1984, 8, 23).toString());
        })
        ;
    });

    it('handles an entry with primaryKey of zero', () => {
      const username = 'user';
      const newUsername = 'newUser';

      return UserWithNoAutoIncrementation.create<UserWithNoAutoIncrementation>({id: 0, username})
        .then((user) => {

          expect(user).to.be.ok;
          expect(user.id).to.equal(0);
          expect(user.username).to.equal(username);
        })
        .then(() => UserWithNoAutoIncrementation.findById<UserWithNoAutoIncrementation>(0))
        .then((user) => {

          expect(user).to.be.ok;
          expect(user.id).to.equal(0);
          expect(user.username).to.equal(username);

          return user.updateAttributes({username: newUsername});
        })
        .then((user) => {

          expect(user).to.be.ok;
          expect(user.id).to.equal(0);
          expect(user.username).to.equal(newUsername);
        });
    });

    it('updates the timestamps', () => {
      const clock = useFakeTimers();
      const now = new Date();

      const user = TimeStampsUser.build<TimeStampsUser>({username: 'user'});

      clock.tick(1000);

      return user
        .save()
        .then(() => {
          expect(user).to.have.property('updatedAt');
          expect(user.updatedAt).to.be.least(now as any);
        })
        ;
    });

    it('does not update timestamps when passing silent=true', () => {

      const clock = useFakeTimers();

      return TimeStampsUser
        .create<TimeStampsUser>({username: 'user'})
        .then((user) => {

          const updatedAt = user.updatedAt;

          clock.tick(1000);

          return user
            .update({username: 'userman'}, {silent: true})
            .then(() => {
              expect(user).to.have.property('updatedAt').equalTime(updatedAt);
            })
            ;
        })
        ;
    });

    it('does not update timestamps when passing silent=true in a bulk update', () => {
      let updatedAtPeter;
      let updatedAtPaul;
      const clock = useFakeTimers();
      const data = [
        {username: 'Paul'},
        {username: 'Peter'}
      ];

      return TimeStampsUser
        .bulkCreate<TimeStampsUser>(data)
        .then(() => TimeStampsUser.findAll<TimeStampsUser>())
        .then((users) => {
          updatedAtPaul = users[0].updatedAt;
          updatedAtPeter = users[1].updatedAt;
        })
        .then(() => {

          clock.tick(150);

          return TimeStampsUser
            .update(
              {aNumber: 1},
              {where: {}, silent: true}
            );
        })
        .then(() => TimeStampsUser.findAll<TimeStampsUser>())
        .then((users) => {
          expect(users[0].updatedAt).to.equalTime(updatedAtPeter);
          expect(users[1].updatedAt).to.equalTime(updatedAtPaul);
        });
    });

    describe('when nothing changed', () => {

      let clock;

      beforeEach(() => clock = useFakeTimers());

      afterEach(() => clock.restore());

      it('does not update timestamps', () =>
        TimeStampsUser
          .create({username: 'John'})
          .then(() => TimeStampsUser.findOne<TimeStampsUser>({where: {username: 'John'}}))
          .then((user) => {

            const updatedAt = user.updatedAt;
            clock.tick(2000);

            return user
              .save()
              .then((newlySavedUser) => {

                expect(newlySavedUser.updatedAt).to.equalTime(updatedAt);

                return TimeStampsUser
                  .findOne<TimeStampsUser>({where: {username: 'John'}})
                  .then((_newlySavedUser) => {

                    expect(_newlySavedUser.updatedAt).to.equalTime(updatedAt);
                  });
              });
          })
      );

      // Does not create an empty query but a corrupted one;
      // Since "bio" is a virtual field, sequelize produces this
      // query "UPDATE `UserWithSwag` SET  WHERE `id` = 1", which
      // also throws
      // "'SequelizeDatabaseError: SQLITE_ERROR: near "WHERE": syntax error'"
      // TODO@robin check if sequelize-typescript causes this problem or not
      // TODO@robin  - it does not seem so
      // it('should not throw ER_EMPTY_QUERY if changed only virtual fields', () =>
      //   UserWithSwag
      //     .sync({force: true})
      //     .then(() => UserWithSwag.create<UserWithSwag>({name: 'John', bio: 'swag 1'}))
      //     .then((user) => expect(user.update({bio: 'swag 2'})).to.be.fulfilled)
      // );
    });

    it('updates with function and column value', () =>
      User
        .create<User>({
          aNumber: 42
        })
        .then((user) => {

          user.bNumber = sequelize.col('aNumber') as any;
          user.username = sequelize.fn('upper', 'sequelize') as any;

          return user
            .save()
            .then(() => User.findById<User>(user.id))
            .then((user2) => {
              expect(user2.username).to.equal('SEQUELIZE');
              expect(user2.bNumber).to.equal(42);
            });
        })
    );

    describe('without timestamps option', () => {

      it("doesn't update the updatedAt column", () =>
        UserWithCustomUpdatedAt
          .sync()
          .then(() => UserWithCustomUpdatedAt.create<UserWithCustomUpdatedAt>({username: 'john doe'}))
          .then((johnDoe) => {
            // sqlite and mysql return undefined, whereas postgres returns null
            expect([undefined, null].indexOf(johnDoe.updatedAt)).not.to.be.equal(-1);
          })
      );
    });

    describe('with custom timestamp options', () => {

      it('updates the createdAt column if updatedAt is disabled', () => {
        const now = new Date();
        const clock = useFakeTimers();
        clock.tick(1000);

        UserWithCreatedAtButWithoutUpdatedAt
          .sync()
          .then(() => UserWithCreatedAtButWithoutUpdatedAt
            .create<UserWithCreatedAtButWithoutUpdatedAt>({username: 'john doe'}))
          .then((johnDoe) => {
            expect(johnDoe).not.to.have.property('updatedAt');
            expect(now).to.be.beforeTime(johnDoe['createdAt']); // TODO@robin createdAt type safe (interface??)
          })
        ;
      });

      // it('updates the updatedAt column if createdAt is disabled', () => {
      //   var now = new Date();
      //   this.clock.tick(1000);
      //
      //   var User2 = this.sequelize.define('User2', {
      //     username: DataTypes.STRING
      //   }, {createdAt: false});
      //
      //   user2.sync().then(() => {
      //     user2.create({username: 'john doe'}).then((johnDoe) => {
      //       expect(johnDoe.createdAt).to.be.undefined;
      //       expect(now).to.be.beforeTime(johnDoe.updatedAt);
      //     });
      //   });
      // });
      //
      // it('works with `allowNull: false` on createdAt and updatedAt columns', () => {
      //   var User2 = this.sequelize.define('User2', {
      //     username: DataTypes.STRING,
      //     createdAt: {
      //       type: DataTypes.DATE,
      //       allowNull: false
      //     },
      //     updatedAt: {
      //       type: DataTypes.DATE,
      //       allowNull: false
      //     }
      //   }, {timestamps: true});
      //
      //   user2.sync().then(() => {
      //     user2.create({username: 'john doe'}).then((johnDoe) => {
      //       expect(johnDoe.createdAt).to.be.an.instanceof(Date);
      //       expect(!isNaN(johnDoe.createdAt.valueOf())).to.be.ok;
      //       expect(johnDoe.createdAt).to.equalTime(johnDoe.updatedAt);
      //     });
      //   });
      // });
    });
//
//   it('should fail a validation upon creating', () => {
//     User.create({aNumber: 0, validateTest: 'hello'}).catch((err) => {
//       expect(err).to.exist;
//       expect(err).to.be.instanceof(Object);
//       expect(err.get('validateTest')).to.be.instanceof(Array);
//       expect(err.get('validateTest')[0]).to.exist;
//       expect(err.get('validateTest')[0].message).to.equal('Validation isInt on validateTest failed');
//     });
//   });
//
//   it('should fail a validation upon creating with hooks false', () => {
//     User.create({aNumber: 0, validateTest: 'hello'}, {hooks: false}).catch((err) => {
//       expect(err).to.exist;
//       expect(err).to.be.instanceof(Object);
//       expect(err.get('validateTest')).to.be.instanceof(Array);
//       expect(err.get('validateTest')[0]).to.exist;
//       expect(err.get('validateTest')[0].message).to.equal('Validation isInt on validateTest failed');
//     });
//   });
//
//   it('should fail a validation upon building', () => {
//     User.build({aNumber: 0, validateCustom: 'aaaaaaaaaaaaaaaaaaaaaaaaaa'}).save()
//       .catch((err) => {
//         expect(err).to.exist;
//         expect(err).to.be.instanceof(Object);
//         expect(err.get('validateCustom')).to.exist;
//         expect(err.get('validateCustom')).to.be.instanceof(Array);
//         expect(err.get('validateCustom')[0]).to.exist;
//         expect(err.get('validateCustom')[0].message).to.equal('Length failed.');
//       });
//   });
//
//   it('should fail a validation when updating', () => {
//     User.create({aNumber: 0}).then((user) => {
//       return user.updateAttributes({validateTest: 'hello'}).catch((err) => {
//         expect(err).to.exist;
//         expect(err).to.be.instanceof(Object);
//         expect(err.get('validateTest')).to.exist;
//         expect(err.get('validateTest')).to.be.instanceof(Array);
//         expect(err.get('validateTest')[0]).to.exist;
//         expect(err.get('validateTest')[0].message).to.equal('Validation isInt on validateTest failed');
//       });
//     });
//   });
//
//   it('takes zero into account', () => {
//     User.build({aNumber: 0}).save({
//       fields: ['aNumber']
//     }).then((user) => {
//       expect(user.aNumber).to.equal(0);
//     });
//   });
//
//   it('saves a record with no primary key', () => {
//     var HistoryLog = this.sequelize.define('HistoryLog', {
//       someText: {type: DataTypes.STRING},
//       aNumber: {type: DataTypes.INTEGER},
//       aRandomId: {type: DataTypes.INTEGER}
//     });
//     return HistoryLog.sync().then(() => {
//       return HistoryLog.create({someText: 'Some random text', aNumber: 3, aRandomId: 5}).then((log) => {
//         return log.updateAttributes({aNumber: 5}).then((newLog) => {
//           expect(newLog.aNumber).to.equal(5);
//         });
//       });
//     });
//   });
//
//   describe('eagerly loaded objects', () => {
//     beforeEach(() => {
//
//       this.UserEager = this.sequelize.define('UserEagerLoadingSaves', {
//         username: DataTypes.STRING,
//         age: DataTypes.INTEGER
//       }, {timestamps: false});
//
//       this.ProjectEager = this.sequelize.define('ProjectEagerLoadingSaves', {
//         title: DataTypes.STRING,
//         overdue_days: DataTypes.INTEGER
//       }, {timestamps: false});
//
//       this.UserEager.hasMany(this.ProjectEager, {as: 'Projects', foreignKey: 'PoobahId'});
//       this.ProjectEager.belongsTo(this.UserEager, {as: 'Poobah', foreignKey: 'PoobahId'});
//
//       UserEager.sync({force: true}).then(() => {
//         ProjectEager.sync({force: true});
//       });
//     });
//
//     it('saves one object that has a collection of eagerly loaded objects', () => {
//
//       UserEager.create({username: 'joe', age: 1}).then((user) => {
//         ProjectEager.create({title: 'project-joe1', overdue_days: 0}).then((project1) => {
//           ProjectEager.create({title: 'project-joe2', overdue_days: 0}).then((project2) => {
//             return user.setProjects([project1, project2]).then(() => {
//               UserEager.findOne({
//                 where: {age: 1},
//                 include: [{model: self.ProjectEager, as: 'Projects'}]
//               }).then((user) => {
//                 expect(user.username).to.equal('joe');
//                 expect(user.age).to.equal(1);
//                 expect(user.Projects).to.exist;
//                 expect(user.Projects.length).to.equal(2);
//
//                 user.age = user.age + 1; // happy birthday joe
//                 return user.save().then((user) => {
//                   expect(user.username).to.equal('joe');
//                   expect(user.age).to.equal(2);
//                   expect(user.Projects).to.exist;
//                   expect(user.Projects.length).to.equal(2);
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//
//     it('saves many objects that each a have collection of eagerly loaded objects', () => {
//
//       UserEager.create({username: 'bart', age: 20}).then((bart) => {
//         UserEager.create({username: 'lisa', age: 20}).then((lisa) => {
//           ProjectEager.create({title: 'detention1', overdue_days: 0}).then((detention1) => {
//             ProjectEager.create({title: 'detention2', overdue_days: 0}).then((detention2) => {
//               ProjectEager.create({title: 'exam1', overdue_days: 0}).then((exam1) => {
//                 ProjectEager.create({title: 'exam2', overdue_days: 0}).then((exam2) => {
//                   return bart.setProjects([detention1, detention2]).then(() => {
//                     return lisa.setProjects([exam1, exam2]).then(() => {
//                       UserEager.findAll({
//                         where: {age: 20},
//                         order: [['username', 'ASC']],
//                         include: [{model: self.ProjectEager, as: 'Projects'}]
//                       }).then((simpsons) => {
//                         var _bart, _lisa;
//
//                         expect(simpsons.length).to.equal(2);
//
//                         _bart = simpsons[0];
//                         _lisa = simpsons[1];
//
//                         expect(_bart.Projects).to.exist;
//                         expect(_lisa.Projects).to.exist;
//                         expect(_bart.Projects.length).to.equal(2);
//                         expect(_lisa.Projects.length).to.equal(2);
//
//                         _bart.age = _bart.age + 1; // happy birthday bart - off to Moe's
//
//                         return _bart.save().then((savedbart) => {
//                           expect(savedbart.username).to.equal('bart');
//                           expect(savedbart.age).to.equal(21);
//
//                           _lisa.username = 'lsimpson';
//
//                           return _lisa.save().then((savedlisa) => {
//                             expect(savedlisa.username).to.equal('lsimpson');
//                             expect(savedlisa.age).to.equal(20);
//                           });
//                         });
//                       });
//                     });
//                   });
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//
//     it('saves many objects that each has one eagerly loaded object (to which they belong)', () => {
//
//       UserEager.create({username: 'poobah', age: 18}).then((user) => {
//         ProjectEager.create({title: 'homework', overdue_days: 10}).then((homework) => {
//           ProjectEager.create({title: 'party', overdue_days: 2}).then((party) => {
//             return user.setProjects([homework, party]).then(() => {
//               ProjectEager.findAll({
//                 include: [{
//                   model: self.UserEager,
//                   as: 'Poobah'
//                 }]
//               }).then((projects) => {
//                 expect(projects.length).to.equal(2);
//                 expect(projects[0].Poobah).to.exist;
//                 expect(projects[1].Poobah).to.exist;
//                 expect(projects[0].Poobah.username).to.equal('poobah');
//                 expect(projects[1].Poobah.username).to.equal('poobah');
//
//                 projects[0].title = 'partymore';
//                 projects[1].title = 'partymore';
//                 projects[0].overdue_days = 0;
//                 projects[1].overdue_days = 0;
//
//                 return projects[0].save().then(() => {
//                   return projects[1].save().then(() => {
//                     ProjectEager.findAll({
//                       where: {title: 'partymore', overdue_days: 0},
//                       include: [{model: self.UserEager, as: 'Poobah'}]
//                     }).then((savedprojects) => {
//                       expect(savedprojects.length).to.equal(2);
//                       expect(savedprojects[0].Poobah).to.exist;
//                       expect(savedprojects[1].Poobah).to.exist;
//                       expect(savedprojects[0].Poobah.username).to.equal('poobah');
//                       expect(savedprojects[1].Poobah.username).to.equal('poobah');
//                     });
//                   });
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//   });
  });
//
// describe('many to many relations', () => {
//   var udo;
//   beforeEach(() => {
//
//     this.User = this.sequelize.define('UserWithUsernameAndAgeAndIsAdmin', {
//       username: DataTypes.STRING,
//       age: DataTypes.INTEGER,
//       isAdmin: DataTypes.BOOLEAN
//     }, {timestamps: false});
//
//     this.Project = this.sequelize.define('NiceProject',
//       {title: DataTypes.STRING}, {timestamps: false});
//
//     this.Project.hasMany(this.User);
//     this.User.hasMany(this.Project);
//
//     User.sync({force: true}).then(() => {
//       Project.sync({force: true}).then(() => {
//         User.create({username: 'fnord', age: 1, isAdmin: true})
//           .then((user) => {
//             udo = user;
//           });
//       });
//     });
//   });
//
//   it.skip('Should assign a property to the instance', () => {
//     // @thanpolas rethink this test, it doesn't make sense, a relation has
//     // to be created first in the beforeEach().
//     User.findOne({id: udo.id})
//       .then((user) => {
//         user.NiceProjectId = 1;
//         expect(user.NiceProjectId).to.equal(1);
//       });
//   });
// });
//
// describe('toJSON', () => {
//   beforeEach(() => {
//
//     this.User = this.sequelize.define('UserWithUsernameAndAgeAndIsAdmin', {
//       username: DataTypes.STRING,
//       age: DataTypes.INTEGER,
//       isAdmin: DataTypes.BOOLEAN
//     }, {timestamps: false});
//
//     this.Project = this.sequelize.define('NiceProject', {title: DataTypes.STRING}, {timestamps: false});
//
//     this.User.hasMany(this.Project, {as: 'Projects', foreignKey: 'lovelyUserId'});
//     this.Project.belongsTo(this.User, {as: 'LovelyUser', foreignKey: 'lovelyUserId'});
//
//     User.sync({force: true}).then(() => {
//       Project.sync({force: true});
//     });
//   });
//
//   it("dont return instance that isn't defined", () => {
//
//     Project.create({lovelyUserId: null})
//       .then((project) => {
//         Project.findOne({
//           where: {
//             id: project.id
//           },
//           include: [
//             {model: self.User, as: 'LovelyUser'}
//           ]
//         });
//       })
//       .then((project) => {
//         var json = project.toJSON();
//         expect(json.LovelyUser).to.be.equal(null);
//       });
//   });
//
//   it("dont return instances that aren't defined", () => {
//
//     User.create({username: 'cuss'})
//       .then((user) => {
//         User.findOne({
//           where: {
//             id: user.id
//           },
//           include: [
//             {model: self.Project, as: 'Projects'}
//           ]
//         });
//       })
//       .then((user) => {
//         expect(user.Projects).to.be.instanceof(Array);
//         expect(user.Projects).to.be.length(0);
//       });
//   });
//
//   it('returns an object containing all values', () => {
//     var user = this.User.build({username: 'test.user', age: 99, isAdmin: true});
//     expect(user.toJSON()).to.deep.equal({username: 'test.user', age: 99, isAdmin: true, id: null});
//   });
//
//   it('returns a response that can be stringified', () => {
//     var user = this.User.build({username: 'test.user', age: 99, isAdmin: true});
//     expect(JSON.stringify(user)).to.deep.equal('{"id":null,"username":"test.user","age":99,"isAdmin":true}');
//   });
//
//   it('returns a response that can be stringified and then parsed', () => {
//     var user = this.User.build({username: 'test.user', age: 99, isAdmin: true});
//     expect(JSON.parse(JSON.stringify(user))).to.deep.equal({
//       username: 'test.user',
//       age: 99,
//       isAdmin: true,
//       id: null
//     });
//   });
//
//   it('includes the eagerly loaded associations', () => {
//
//     User.create({username: 'fnord', age: 1, isAdmin: true}).then((user) => {
//       Project.create({title: 'fnord'}).then((project) => {
//         return user.setProjects([project]).then(() => {
//           User.findAll({include: [{model: self.Project, as: 'Projects'}]}).then((users) => {
//             var _user = users[0];
//
//             expect(_user.Projects).to.exist;
//             expect(JSON.parse(JSON.stringify(_user)).Projects).to.exist;
//
//             Project.findAll({include: [{model: self.User, as: 'LovelyUser'}]}).then((projects) => {
//               var _project = projects[0];
//
//               expect(_project.LovelyUser).to.exist;
//               expect(JSON.parse(JSON.stringify(_project)).LovelyUser).to.exist;
//             });
//           });
//         });
//       });
//     });
//   });
// });
//
// describe('findAll', () => {
//   beforeEach(() => {
//     this.ParanoidUser = this.sequelize.define('ParanoidUser', {
//       username: {type: DataTypes.STRING}
//     }, {paranoid: true});
//
//     this.ParanoidUser.hasOne(this.ParanoidUser);
//     ParanoidUser.sync({force: true});
//   });
//
//   it('sql should have paranoid condition', () => {
//
//     ParanoidUser.create({username: 'cuss'})
//       .then(() => {
//         ParanoidUser.findAll();
//       })
//       .then((users) => {
//         expect(users).to.have.length(1);
//         return users[0].destroy();
//       })
//       .then(() => {
//         ParanoidUser.findAll();
//       })
//       .then((users) => {
//         expect(users).to.have.length(0);
//       });
//   });
//
//   it('sequelize.and as where should include paranoid condition', () => {
//
//     ParanoidUser.create({username: 'cuss'})
//       .then(() => {
//         ParanoidUser.findAll({
//           where: self.sequelize.and({
//             username: 'cuss'
//           })
//         });
//       })
//       .then((users) => {
//         expect(users).to.have.length(1);
//         return users[0].destroy();
//       })
//       .then(() => {
//         ParanoidUser.findAll({
//           where: self.sequelize.and({
//             username: 'cuss'
//           })
//         });
//       })
//       .then((users) => {
//         expect(users).to.have.length(0);
//       });
//   });
//
//   it('sequelize.or as where should include paranoid condition', () => {
//
//     ParanoidUser.create({username: 'cuss'})
//       .then(() => {
//         ParanoidUser.findAll({
//           where: self.sequelize.or({
//             username: 'cuss'
//           })
//         });
//       })
//       .then((users) => {
//         expect(users).to.have.length(1);
//         return users[0].destroy();
//       })
//       .then(() => {
//         ParanoidUser.findAll({
//           where: self.sequelize.or({
//             username: 'cuss'
//           })
//         });
//       })
//       .then((users) => {
//         expect(users).to.have.length(0);
//       });
//   });
//
//   it('escapes a single single quotes properly in where clauses', () => {
//
//     User
//       .create({username: "user'name"})
//       .then(() => {
//         User.findAll({
//           where: {username: "user'name"}
//         }).then((users) => {
//           expect(users.length).to.equal(1);
//           expect(users[0].username).to.equal("user'name");
//         });
//       });
//   });
//
//   it('escapes two single quotes properly in where clauses', () => {
//
//     User
//       .create({username: "user''name"})
//       .then(() => {
//         User.findAll({
//           where: {username: "user''name"}
//         }).then((users) => {
//           expect(users.length).to.equal(1);
//           expect(users[0].username).to.equal("user''name");
//         });
//       });
//   });
//
//   it('returns the timestamps if no attributes have been specified', () => {
//
//     User.create({username: 'fnord'}).then(() => {
//       User.findAll().then((users) => {
//         expect(users[0].createdAt).to.exist;
//       });
//     });
//   });
//
//   it('does not return the timestamps if the username attribute has been specified', () => {
//
//     User.create({username: 'fnord'}).then(() => {
//       User.findAll({attributes: ['username']}).then((users) => {
//         expect(users[0].createdAt).not.to.exist;
//         expect(users[0].username).to.exist;
//       });
//     });
//   });
//
//   it('creates the deletedAt property, when defining paranoid as true', () => {
//
//     ParanoidUser.create({username: 'fnord'}).then(() => {
//       ParanoidUser.findAll().then((users) => {
//         expect(users[0].deletedAt).to.be.null;
//       });
//     });
//   });
//
//   it('destroys a record with a primary key of something other than id', () => {
//     var UserDestroy = this.sequelize.define('UserDestroy', {
//       newId: {
//         type: DataTypes.STRING,
//         primaryKey: true
//       },
//       email: DataTypes.STRING
//     });
//
//     return UserDestroy.sync().then(() => {
//       return UserDestroy.create({newId: '123ABC', email: 'hello'}).then(() => {
//         return UserDestroy.findOne({where: {email: 'hello'}}).then((user) => {
//           return user.destroy();
//         });
//       });
//     });
//   });
//
//   it('sets deletedAt property to a specific date when deleting an instance', () => {
//
//     ParanoidUser.create({username: 'fnord'}).then(() => {
//       ParanoidUser.findAll().then((users) => {
//         return users[0].destroy().then(() => {
//           expect(users[0].deletedAt.getMonth).to.exist;
//
//           return users[0].reload({paranoid: false}).then((user) => {
//             expect(user.deletedAt.getMonth).to.exist;
//           });
//         });
//       });
//     });
//   });
//
//   it('keeps the deletedAt-attribute with value null, when running updateAttributes', () => {
//
//     ParanoidUser.create({username: 'fnord'}).then(() => {
//       ParanoidUser.findAll().then((users) => {
//         return users[0].updateAttributes({username: 'newFnord'}).then((user) => {
//           expect(user.deletedAt).not.to.exist;
//         });
//       });
//     });
//   });
//
//   it('keeps the deletedAt-attribute with value null, when updating associations', () => {
//
//     ParanoidUser.create({username: 'fnord'}).then(() => {
//       ParanoidUser.findAll().then((users) => {
//         ParanoidUser.create({username: 'linkedFnord'}).then((linkedUser) => {
//           return users[0].setParanoidUser(linkedUser).then((user) => {
//             expect(user.deletedAt).not.to.exist;
//           });
//         });
//       });
//     });
//   });
//
//   it('can reuse query option objects', () => {
//
//     User.create({username: 'fnord'}).then(() => {
//       var query = {where: {username: 'fnord'}};
//       User.findAll(query).then((users) => {
//         expect(users[0].username).to.equal('fnord');
//         User.findAll(query).then((users) => {
//           expect(users[0].username).to.equal('fnord');
//         });
//       });
//     });
//   });
// });
//
// describe('find', () => {
//   it('can reuse query option objects', () => {
//
//     User.create({username: 'fnord'}).then(() => {
//       var query = {where: {username: 'fnord'}};
//       User.findOne(query).then((user) => {
//         expect(user.username).to.equal('fnord');
//         User.findOne(query).then((user) => {
//           expect(user.username).to.equal('fnord');
//         });
//       });
//     });
//   });
//   it('returns null for null, undefined, and unset boolean values', () => {
//     var Setting = this.sequelize.define('SettingHelper', {
//       setting_key: DataTypes.STRING,
//       bool_value: {type: DataTypes.BOOLEAN, allowNull: true},
//       bool_value2: {type: DataTypes.BOOLEAN, allowNull: true},
//       bool_value3: {type: DataTypes.BOOLEAN, allowNull: true}
//     }, {timestamps: false, logging: false});
//
//     return Setting.sync({force: true}).then(() => {
//       return Setting.create({setting_key: 'test', bool_value: null, bool_value2: undefined}).then(() => {
//         return Setting.findOne({where: {setting_key: 'test'}}).then((setting) => {
//           expect(setting.bool_value).to.equal(null);
//           expect(setting.bool_value2).to.equal(null);
//           expect(setting.bool_value3).to.equal(null);
//         });
//       });
//     });
//   });
// });
//
// describe('equals', () => {
//   it('can compare records with Date field', () => {
//
//     User.create({username: 'fnord'}).then((user1) => {
//       User.findOne({where: {username: 'fnord'}}).then((user2) => {
//         expect(user1.equals(user2)).to.be.true;
//       });
//     });
//   });
//
//   it('does not compare the existence of associations', function() {
//
//
//     this.UserAssociationEqual = this.sequelize.define('UserAssociationEquals', {
//       username: DataTypes.STRING,
//       age: DataTypes.INTEGER
//     }, {timestamps: false});
//
//     this.ProjectAssociationEqual = this.sequelize.define('ProjectAssocationEquals', {
//       title: DataTypes.STRING,
//       overdue_days: DataTypes.INTEGER
//     }, {timestamps: false});
//
//     this.UserAssociationEqual.hasMany(this.ProjectAssociationEqual, {as: 'Projects', foreignKey: 'userId'});
//     this.ProjectAssociationEqual.belongsTo(this.UserAssociationEqual, {as: 'Users', foreignKey: 'userId'});
//
//     UserAssociationEqual.sync({force: true}).then(() => {
//       ProjectAssociationEqual.sync({force: true}).then(function() {
//         UserAssociationEqual.create({username: 'jimhalpert'}).then(function(user1) {
//           ProjectAssociationEqual.create({title: 'A Cool Project'}).then(function(project1) {
//             user1.setProjects([project1]).then(function() {
//               UserAssociationEqual.findOne({
//                 where: {username: 'jimhalpert'},
//                 include: [{model: self.ProjectAssociationEqual, as: 'Projects'}]
//               }).then(function(user2) {
//                 UserAssociationEqual.create({username: 'pambeesly'}).then(function(user3) {
//                   expect(user1.get('Projects')).to.not.exist;
//                   expect(user2.get('Projects')).to.exist;
//                   expect(user1.equals(user2)).to.be.true;
//                   expect(user2.equals(user1)).to.be.true;
//                   expect(user1.equals(user3)).to.not.be.true;
//                   expect(user3.equals(user1)).to.not.be.true;
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//   });
// });
//
// describe('values', () => {
//   it('returns all values', () => {
//     var User = this.sequelize.define('UserHelper', {
//       username: DataTypes.STRING
//     }, {timestamps: false, logging: false});
//
//     return User.sync().then(() => {
//       var user = User.build({username: 'foo'});
//       expect(user.get({plain: true})).to.deep.equal({username: 'foo', id: null});
//     });
//   });
// });
//
// describe('destroy', () => {
//   if (current.dialect.supports.transactions) {
//     it('supports transactions', () => {
//       return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
//         var User = sequelize.define('User', {username: Support.Sequelize.STRING});
//
//         return User.sync({force: true}).then(() => {
//           return User.create({username: 'foo'}).then((user) => {
//             return sequelize.transaction().then((t) => {
//               return user.destroy({transaction: t}).then(() => {
//                 return User.count().then((count1) => {
//                   return User.count({transaction: t}).then((count2) => {
//                     expect(count1).to.equal(1);
//                     expect(count2).to.equal(0);
//                     return t.rollback();
//                   });
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//   }
//
//   it('does not set the deletedAt date in subsequent destroys if dao is paranoid', () => {
//     var UserDestroy = this.sequelize.define('UserDestroy', {
//       name: Support.Sequelize.STRING,
//       bio: Support.Sequelize.TEXT
//     }, {paranoid: true});
//
//     return UserDestroy.sync({force: true}).then(() => {
//       return UserDestroy.create({name: 'hallo', bio: 'welt'}).then((user) => {
//         return user.destroy().then(() => {
//           return user.reload({paranoid: false}).then(() => {
//             var deletedAt = user.deletedAt;
//
//             return user.destroy().then(() => {
//               return user.reload({paranoid: false}).then(() => {
//                 expect(user.deletedAt).to.eql(deletedAt);
//               });
//             });
//           });
//         });
//       });
//     });
//   });
//
//   it('deletes a record from the database if dao is not paranoid', () => {
//     var UserDestroy = this.sequelize.define('UserDestroy', {
//       name: Support.Sequelize.STRING,
//       bio: Support.Sequelize.TEXT
//     });
//
//     return UserDestroy.sync({force: true}).then(() => {
//       return UserDestroy.create({name: 'hallo', bio: 'welt'}).then((u) => {
//         return UserDestroy.findAll().then((users) => {
//           expect(users.length).to.equal(1);
//           return u.destroy().then(() => {
//             return UserDestroy.findAll().then((users) => {
//               expect(users.length).to.equal(0);
//             });
//           });
//         });
//       });
//     });
//   });
//
//   it('allows sql logging of delete statements', () => {
//     var UserDelete = this.sequelize.define('UserDelete', {
//       name: Support.Sequelize.STRING,
//       bio: Support.Sequelize.TEXT
//     });
//
//     return UserDelete.sync({force: true}).then(() => {
//       return UserDelete.create({name: 'hallo', bio: 'welt'}).then((u) => {
//         return UserDelete.findAll().then((users) => {
//           expect(users.length).to.equal(1);
//           return u.destroy({
//             logging: function(sql) {
//               expect(sql).to.exist;
//               expect(sql.toUpperCase().indexOf('DELETE')).to.be.above(-1);
//             }
//           });
//         });
//       });
//     });
//   });
//
//   it('delete a record of multiple primary keys table', () => {
//     var MultiPrimary = this.sequelize.define('MultiPrimary', {
//       bilibili: {
//         type: Support.Sequelize.CHAR(2),
//         primaryKey: true
//       },
//
//       guruguru: {
//         type: Support.Sequelize.CHAR(2),
//         primaryKey: true
//       }
//     });
//
//     return MultiPrimary.sync({force: true}).then(() => {
//       return MultiPrimary.create({bilibili: 'bl', guruguru: 'gu'}).then(() => {
//         return MultiPrimary.create({bilibili: 'bl', guruguru: 'ru'}).then((m2) => {
//           return MultiPrimary.findAll().then((ms) => {
//             expect(ms.length).to.equal(2);
//             return m2.destroy({
//               logging: (sql) => {
//                 expect(sql).to.exist;
//                 expect(sql.toUpperCase().indexOf('DELETE')).to.be.above(-1);
//                 expect(sql.indexOf('ru')).to.be.above(-1);
//                 expect(sql.indexOf('bl')).to.be.above(-1);
//               }
//             }).then(() => {
//               return MultiPrimary.findAll().then((ms) => {
//                 expect(ms.length).to.equal(1);
//                 expect(ms[0].bilibili).to.equal('bl');
//                 expect(ms[0].guruguru).to.equal('gu');
//               });
//             });
//           });
//         });
//       });
//     });
//   });
// });
//
// describe('restore', () => {
//   it('returns an error if the model is not paranoid', () => {
//     User.create({username: 'Peter', secretValue: '42'}).then((user) => {
//       expect(() => {
//         user.restore();
//       }).to.throw(Error, 'Model is not paranoid');
//     });
//   });
//
//   it('restores a previously deleted model', () => {
//     var self = this
//       , ParanoidUser = self.sequelize.define('ParanoidUser', {
//       username: DataTypes.STRING,
//       secretValue: DataTypes.STRING,
//       data: DataTypes.STRING,
//       intVal: {type: DataTypes.INTEGER, defaultValue: 1}
//     }, {
//       paranoid: true
//     })
//       , data = [{username: 'Peter', secretValue: '42'},
//       {username: 'Paul', secretValue: '43'},
//       {username: 'Bob', secretValue: '44'}];
//
//     return ParanoidUser.sync({force: true}).then(() => {
//       return ParanoidUser.bulkCreate(data);
//     }).then(() => {
//       return ParanoidUser.findOne({where: {secretValue: '42'}});
//     }).then((user) => {
//       return user.destroy().then(() => {
//         return user.restore();
//       });
//     }).then(() => {
//       return ParanoidUser.findOne({where: {secretValue: '42'}});
//     }).then((user) => {
//       expect(user).to.be.ok;
//       expect(user.username).to.equal('Peter');
//     });
//   });
// });

});
