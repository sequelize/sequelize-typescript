import * as Promise from 'bluebird';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { useFakeTimers } from 'sinon';
import { ValidationError } from 'sequelize';
import * as validateUUID from 'uuid-validate';
import chaiDatetime = require('chai-datetime');

import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Sequelize, Table } from "../../src";
import { TableOptions } from "../../src/model/table/table-options";
import { Book } from "../models/Book";
import { Box } from "../models/Box";
import { Page } from "../models/Page";
import { Person } from "../models/Person";
import { Player } from "../models/Player";
import { Shoe } from "../models/Shoe";
import { Team } from "../models/Team";
import { TimeStampsUser } from "../models/TimeStampsUser";
import { User } from "../models/User";
import { UserWithCreatedAtButWithoutUpdatedAt } from "../models/UserWithCreatedAtButWithoutUpdatedAt";
import { UserWithCustomUpdatedAt } from "../models/UserWithCustomUpdatedAt";
import { UserWithNoAutoIncrementation } from "../models/UserWithNoAutoIncrementation";
import { UserWithValidation } from "../models/UserWithValidation";
import { UserWithVersion } from "../models/UserWithVersion";
import { createSequelize } from "../utils/sequelize";
// import {UserWithSwag} from "../models/UserWithSwag";

// TODO@robin create belongs to many with through options "add" test

const {InstanceError} = require('sequelize');

use(chaiAsPromised);
use(chaiDatetime);

/* tslint:disable:max-classes-per-file */

describe('instance', () => {

  let sequelize: Sequelize;

  before(() => sequelize = createSequelize());

  beforeEach(() => sequelize.sync({force: true}));

  describe('instanceof', () => {

    beforeEach(() =>
      Promise.all([
        Book.create({
          title: 'Crime and Punishment',
          pages: [{content: 'A'}]
        }, {include: [Page]}),
        Book.create({
          title: 'The Brothers Karamazov',
          pages: [{content: 'B'}, {content: 'C'}]
        }, {include: [Page]})
      ])
    );

    it('should return true for found instance (findOne)', () =>
      Book
        .findOne()
        .then(book => {
          expect(book).to.be.an.instanceof(Book);
          expect(book).to.be.an.instanceof(Model);
        })
    );

    it('should return true for found instances (findAll)', () =>
      Book
        .findAll()
        .then(books => {

          books.forEach(book => {

            expect(book).to.be.an.instanceof(Book);
            expect(book).to.be.an.instanceof(Model);
          });
        })
    );

    it('should return true for include values of found instance', () =>
      Book
        .findOne({include: [Page]})
        .then(book => {

          book.pages.forEach(page => {

            expect(page).to.be.an.instanceof(Page);
            expect(page).to.be.an.instanceof(Model);
          });
        })
    );
  });

  describe('isNewRecord', () => {

    it('returns true for non-saved objects', () => {
      const user = User.build({username: 'user'});
      expect(user.id).to.be.null;
      expect(user.isNewRecord).to.be.ok;
    });

    it('returns false for saved objects', () =>
      User
        .build({username: 'user'})
        .save()
        .then((user) => {
          expect(user.isNewRecord).to.not.be.ok;
        })
    );

    it('returns false for created objects', () =>
      User
        .create({username: 'user'})
        .then((user) => {
          expect(user.id).to.not.be.null;
          expect(user.isNewRecord).to.not.be.ok;
        })
    );

    it('returns false for objects found by find method', () =>
      User
        .create({username: 'user'})
        .then(() =>
          User
            .create({username: 'user'})
            .then((user) =>
              User
                .findByPk(user.id)
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
            .findAll()
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
    //                       .findAll({transaction})
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


    it('supports returning', () => {

      if (sequelize['dialect']['supports']['returnValues']) {
        User
          .findByPk(1)
          .then((user1) => {

            if (user1) {
              return user1
                .increment('aNumber', {by: 2})
                .then(() => {
                  expect(user1.aNumber).to.be.equal(2);
                });
            }
          });
      }
    });

    it('supports where conditions', () =>
      User
        .findByPk(1)
        .then((user1) => {

            if (user1) {

              return user1.increment(['aNumber'], {by: 2, where: {bNumber: 1}})
                .then(() =>
                  User
                    .findByPk(1)
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
        .findByPk(1)
        .then((user1) =>
          user1.increment(['aNumber'], {by: 2})
            .then(() =>
              User
                .findByPk(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(2);
                })
            )
        )
    );

    it('with single field', () =>
      User
        .findByPk(1)
        .then((user1) =>
          user1
            .increment('aNumber', {by: 2})
            .then(() =>
              User
                .findByPk(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(2);
                })
            )
        )
    );

    it('with single field and no value', () =>
      User
        .findByPk(1)
        .then((user1) =>
          user1.increment('aNumber')
            .then(() =>
              User
                .findByPk(1)
                .then((user2) => {
                  expect(user2.aNumber).to.be.equal(1);
                })
            )
        )
    );

    it('should still work right with other concurrent updates', () =>
      User
        .findByPk(1)
        .then((user1) =>
          // Select the user again (simulating a concurrent query)
          User
            .findByPk(1)
            .then((user2) =>
              user2
                .update({
                  aNumber: user2.aNumber + 1
                })
                .then(() =>
                  user1
                    .increment(['aNumber'], {by: 2})
                    .then(() =>
                      User
                        .findByPk(1)
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
        .findByPk(1)
        .then((user1) =>
          Promise.all([
            user1.increment(['aNumber'], {by: 2}),
            user1.increment(['aNumber'], {by: 2}),
            user1.increment(['aNumber'], {by: 2})
          ])
            .then(() =>
              User
                .findByPk(1)
                .then((user2) => {
                  expect(user2.aNumber).to.equal(6);
                })
            )
        )
    );

    it('with key value pair', () =>
      User
        .findByPk(1)
        .then((user1) =>
          user1
            .increment({aNumber: 1, bNumber: 2})
            .then(() =>
              User
                .findByPk(1)
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
        .then(() => TimeStampsUser.create({aNumber: 1}))
        .then((user) => {

          oldDate = user.updatedAt;

          clock.tick(1000);

          return user.increment('aNumber', {by: 1});
        })
        .then(() => TimeStampsUser.findByPk(1))
        .then(user => {
          expect(user).to.have.property('updatedAt');
          expect(user.updatedAt).to.be.greaterThan(oldDate);
        });
    });

    it('with timestamps set to true and options.silent set to true', () => {

      let oldDate;

      return TimeStampsUser
        .sync({force: true})
        .then(() => TimeStampsUser.create({aNumber: 1}))
        .then((user) => {

          oldDate = user.updatedAt;

          return user.increment('aNumber', {by: 1, silent: true});
        })
        .then(() => TimeStampsUser.findByPk(1))
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
    //       .create({aNumber: 3})
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
    //                       .findAll({transaction})
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
        .create({aNumber: 0})
        .then(() => User.findByPk(1))
        .then((user1) =>
          user1
            .decrement(['aNumber'], {by: 2})
            .then(() =>
              User
                .findByPk(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(-2);
                })
            )
        )
    );

    it('with single field', () =>
      User
        .create({aNumber: 0})
        .then(() => User.findByPk(1))
        .then((user1) =>
          user1
            .decrement('aNumber', {by: 2})
            .then(() =>
              User
                .findByPk(1)
                .then((user3) => {
                  expect(user3.aNumber).to.be.equal(-2);
                })
            )
        )
    );

    it('with single field and no value', () =>
      User
        .create({aNumber: 0})
        .then(() => User.findByPk(1))
        .then((user1) =>
          user1
            .decrement('aNumber')
            .then(() =>
              User
                .findByPk(1)
                .then((user2) => {
                  expect(user2.aNumber).to.be.equal(-1);
                })
            )
        )
    );

    it('should still work right with other concurrent updates', () =>
      User
        .create({aNumber: 0})
        .then(() => User.findByPk(1))
        .then((user1) =>
          // Select the user again (simulating a concurrent query)
          User
            .findByPk(1)
            .then((user2) =>
              user2
                .update({
                  aNumber: user2.aNumber + 1
                })
                .then(() =>
                  user1
                    .decrement(['aNumber'], {by: 2})
                    .then(() =>
                      User
                        .findByPk(1)
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
        .create({aNumber: 0})
        .then(() => User.findByPk(1))
        .then((user1) =>
          Promise.all([
            user1.decrement(['aNumber'], {by: 2}),
            user1.decrement(['aNumber'], {by: 2}),
            user1.decrement(['aNumber'], {by: 2})
          ])
            .then(() =>
              User
                .findByPk(1)
                .then((user2) => {
                  expect(user2.aNumber).to.equal(-6);
                })
            )
        )
    );

    it('with key value pair', () =>
      User
        .create({aNumber: 0, bNumber: 0})
        .then(() => User.findByPk(1))
        .then((user1) =>
          user1
            .decrement({aNumber: 1, bNumber: 2})
            .then(() =>
              User
                .findByPk(1)
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
        .then(() => TimeStampsUser.create({aNumber: 1}))
        .then((user) => {
          oldDate = user.updatedAt;

          clock.tick(1000);

          return user.decrement('aNumber', {by: 1});
        })
        .then(() => TimeStampsUser.findByPk(1))
        .then(user => {
          expect(user).to.have.property('updatedAt');
          expect(user.updatedAt).to.be.greaterThan(oldDate);
        });
    });

    it('with timestamps set to true and options.silent set to true', () => {

      let oldDate;

      return TimeStampsUser
        .sync({force: true})
        .then(() => TimeStampsUser.create({aNumber: 1}))
        .then((user) => {
          oldDate = user.updatedAt;
          return user.decrement('aNumber', {by: 1, silent: true});
        })
        .then(() => TimeStampsUser.findByPk(1))
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
    //           .create({username: 'foo'})
    //           .then((user) =>
    //             sequelize
    //               .transaction()
    //               .then((transaction) =>
    //                 User
    //                   .update({username: 'bar'}, {where: {username: 'foo'}, transaction})
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
        .create({username: 'John Doe'})
        .then((originalUser) =>
          originalUser
            .update({username: 'Doe John'})
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
        .create({username: 'John Doe'})
        .then((originalUser) =>
          User
            .findByPk(originalUser.id)
            .then((updater) =>
              updater
                .update({username: 'Doe John'})
                .then(() => {
                  // We used a different reference when calling update, so originalUser is now out of sync
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
        .create({aNumber: 1, bNumber: 1})
        // TODO Sequelize typings issue caused by sequelize/types/lib/model.d.ts on line 2394
        // TODO The order of overloads is wrong
        .tap((user) => User.update({bNumber: 2}, {where: {id: user.get('id') as any}}))
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
        .create({username: 'John Doe'})
        .then((originalUser) => {
          originallyUpdatedAt = originalUser.updatedAt;
          _originalUser = originalUser;

          return TimeStampsUser.findByPk(originalUser.id);
        })
        .then((updater) => updater.update({username: 'Doe John'}))
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
        .then(() => Book.create({title: 'A very old book'}))
        .then((book) =>
          Page
            .create({content: 'om nom nom'})
            .then((page) =>
              book
                .$set('pages', [page])
                .then(() => Book.findOne({where: {id: book.id}, include: [Page]}))
                .then((leBook: Book) =>
                  page
                    .update({content: 'something totally different'})
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
        .then(() => Book.create({title: 'A very old book'}))
        .then((book) =>
          Page
            .create()
            .then((page) =>
              book['setPages']([page]) // todo
                .then(() =>
                  Book
                    .findOne({where: {id: book.id}})
                    .then((leBook) => {
                      return leBook.reload({include: [Page]})
                        .then((_leBook: Book) => {
                          expect(_leBook.pages.length).to.equal(1);
                          expect(_leBook.get({plain: true})['pages'].length).to.equal(1);
                        });
                    })
                )
            )
        )
    );

    it('should return an error when reload fails', () =>
      User
        .create({username: 'John Doe'})
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
        .create({
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
        .create({
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
        const user = User.build({username: 'a user'});
        expect(user.uuidv1).to.be.a('string');
        expect(user.uuidv4).to.be.a('string');
      });

      it('should store a string of length 36 in uuidv1 and uuidv4', () => {
        const user = User.build({username: 'a user'});
        expect(user.uuidv1).to.have.length(36);
        expect(user.uuidv4).to.have.length(36);
      });

      it('should store a valid uuid in uuidv1 and uuidv4 that conforms to the UUID v1 and v4 specifications', () => {
        const user = User.build({username: 'a user'});
        expect(validateUUID(user.uuidv1, 1)).to.be.true;
        expect(validateUUID(user.uuidv4, 4)).to.be.true;
      });

      it('should store a valid uuid if the field is a primary key named id', () => {
        const person = Person.build({});
        expect(person.id).to.be.ok;
        expect(person.id).to.have.length(36);
      });

    });

    describe('current date', () => {

      it('should store a date in touchedAt', () => {
        const user = User.build({username: 'a user'});
        expect(user.touchedAt).to.be.instanceof(Date);
      });

      it('should store the current date in touchedAt', () => {
        const clock = useFakeTimers();
        clock.tick(5000);
        const user = User.build({username: 'a user'});
        clock.restore();
        expect(+user.touchedAt).to.be.equal(5000);
      });
    });

    describe('allowNull date', () => {

      it('should be just "null" and not Date with Invalid Date', () =>
        User
          .build({username: 'a user'})
          .save()
          .then(() =>
            User
              .findOne({where: {username: 'a user'}})
              .then((user) => {
                expect(user.dateAllowNullTrue).to.be.null;
              })
          )
      );

      it('should be the same valid date when saving the date', () => {

        const date = new Date();
        return User
          .build({username: 'a user', dateAllowNullTrue: date})
          .save()
          .then(() =>
            User
              .findOne({where: {username: 'a user'}})
              .then((user) => {
                expect(user.dateAllowNullTrue.toString()).to.equal(date.toString());
              })
          );
      });
    });

    describe('super user boolean', () => {

      it('should default to false', () =>
        User
          .build({
            username: 'a user'
          })
          .save()
          .then(() =>
            User.findOne({
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
          .build({
            username: 'a user',
            isSuperUser: true
          })
          .save()
          .then(() => {
            User.findOne({
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
          .build({
            username: 'a user',
            isSuperUser: "true" as any // by intention
          })
          .save()
          .then(() => {
            User.findOne({
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
          .build({
            username: 'a user',
            isSuperUser: 1
          })
          .save()
          .then(() => {
            User.findOne({
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
          .build({
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
        .findOne({where: ['asdasdasd'] as any})
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
    //           .build({username: 'foo'})
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
        .create({
          username: 'foo',
          touchedAt: new Date()
        })
        .then((user) => {
          user.username = 'fizz';
          user.touchedAt = date;

          return user
            .save({fields: ['username']})
            // re-select user
            .then(() => User.findByPk(user.id))
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

    // TODO Check test
    it('only validates fields in passed array', () =>
      User
        .build({
          ['blabla' as any]: 'cake', // invalid, but not saved
          username: '1'
        })
        .save({
          fields: ['username']
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
          .then(() => User.create({name: 'A', bio: 'A', email: 'A'}))
          .then((user) => user.set({name: 'B', bio: 'B'}).save())
          .then(() => User.findOne({}))
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
          .then(() => User.create({name: 'A', bio: 'A', email: 'A'}))
          .then((user: User) => user.set({name: 'B', bio: 'B', email: 'B'}).save())
          .then(() => User.findOne({}))
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
          .then(() => UserWithValidation.create({
            name: 'A',
            bio: 'A',
            email: 'valid.email@gmail.com'
          }))
          .then((user) =>
            expect(user.set({
              name: 'B'
            }).save()).to.be.rejectedWith(ValidationError)
          )
          .then(() => UserWithValidation.findOne({}))
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
          .then(() => UserWithValidation.create({
            name: 'A',
            bio: 'A',
            email: 'valid.email@gmail.com'
          }))
          .then((user) =>
            expect(user.set({
              name: 'B',
              email: 'still.valid.email@gmail.com'
            }).save()).to.be.rejectedWith(ValidationError)
          )
          .then(() => UserWithValidation.findOne({}))
          .then((user) => {
            expect(user.get('email')).to.equal('valid.email@gmail.com');
          });
      });

    });

    it('stores an entry in the database', () => {
      const username = 'user';
      const user = User.build({
        username,
        touchedAt: new Date(1984, 8, 23)
      });

      return User.findAll()
        .then((users) => {
          expect(users).to.have.length(0);

          return user.save();
        })
        .then(() => User.findAll())
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

      return UserWithNoAutoIncrementation.create({id: 0, username})
        .then((user) => {

          expect(user).to.be.ok;
          expect(user.id).to.equal(0);
          expect(user.username).to.equal(username);
        })
        .then(() => UserWithNoAutoIncrementation.findByPk(0))
        .then((user) => {

          expect(user).to.be.ok;
          expect(user.id).to.equal(0);
          expect(user.username).to.equal(username);

          return user.update({username: newUsername});
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

      const user = TimeStampsUser.build({username: 'user'});

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
        .create({username: 'user'})
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
        .bulkCreate(data)
        .then(() => TimeStampsUser.findAll())
        .then((users) => {
          updatedAtPaul = users[0].updatedAt;
          updatedAtPeter = users[1].updatedAt;
        })
        .then(() => {

          clock.tick(150);

          return TimeStampsUser
            .update(
              {aNumber: 1},
              {
                where: {}, 
                // TODO silent options missing in UpdateOptions
                ['silent' as any]: true
              }
            );
        })
        .then(() => TimeStampsUser.findAll())
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
          .then(() => TimeStampsUser.findOne({where: {username: 'John'}}))
          .then((user) => {

            const updatedAt = user.updatedAt;
            clock.tick(2000);

            return user
              .save()
              .then((newlySavedUser) => {

                expect(newlySavedUser.updatedAt).to.equalTime(updatedAt);

                return TimeStampsUser
                  .findOne({where: {username: 'John'}})
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
      //     .then(() => UserWithSwag.create({name: 'John', bio: 'swag 1'}))
      //     .then((user) => expect(user.update({bio: 'swag 2'})).to.be.fulfilled)
      // );
    });

    it('updates with function and column value', () =>
      User
        .create({
          aNumber: 42
        })
        .then((user) => {

          user.bNumber = Sequelize.col('aNumber') as any;
          user.username = Sequelize.fn('upper', 'sequelize') as any;

          return user
            .save()
            .then(() => User.findByPk(user.id))
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
          .then(() => UserWithCustomUpdatedAt.create({name: 'john doe'}))
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
            .create({name: 'john doe'}))
          .then((johnDoe) => {
            expect(johnDoe).not.to.have.property('updatedAt');
            expect(now).to.be.beforeTime(johnDoe.createdAt);
          })
        ;
      });

      it('updates the updatedAt column if createdAt is disabled', () => {
        const clock = useFakeTimers();
        const now = new Date();
        clock.tick(1000);

        @Table({
          timestamps: true,
          createdAt: false
        })
        class User2 extends Model<User2> {

          @Column
          username: string;
        }

        sequelize.addModels([User2]);

        return User2.sync()
          .then(() => User2.create({username: 'john doe'}))
          .then((johnDoe) => {

            expect(johnDoe.createdAt).to.be.undefined;
            expect(now).to.be.beforeTime(johnDoe.updatedAt);
          });

      });

      it('works with `allowNull: false` on createdAt and updatedAt columns', () => {

        @Table({
          timestamps: true
        })
        class User3 extends Model<User3> {

          @Column
          username: string;

          @AllowNull(false)
          @Column
          createdAt: Date;

          @AllowNull(false)
          @Column
          updatedAt: Date;
        }

        sequelize.addModels([User3]);

        return User3
          .sync()
          .then(() => User3.create({username: 'john doe'}))
          .then((johnDoe) => {
            expect(johnDoe.createdAt).to.be.an.instanceof(Date);
            expect(!isNaN(johnDoe.createdAt.valueOf())).to.be.ok;
            expect(johnDoe.createdAt).to.equalTime(johnDoe.updatedAt);
          });
      });
    });


    describe('with version option', () => {

      it("version column is updated by sequelize", () => {
          let version = undefined;
          UserWithCustomUpdatedAt
            .sync()
            .then(() => UserWithVersion.create({name: 'john doe'}))
            .then((johnDoe: UserWithVersion) => {
              expect(johnDoe.version).not.to.be.undefined;
              version = johnDoe.version;
              return johnDoe.update({name: 'doe john'});
            })
            .then((johnDoe: UserWithVersion) => {
              expect(johnDoe.name).not.equals('doe john');
              expect(johnDoe.version).not.equals(version);
              return johnDoe.update({});
            });
        }
      );
    });


    it('should fail a validation upon creating', () =>
      User
        .create({aNumber: 'hello' as any})
        .catch((err) => {
          expect(err).to.exist;
          expect(err).to.be.instanceof(Object);
          expect(err.get('aNumber')).to.be.instanceof(Array);
          expect(err.get('aNumber')[0]).to.exist;
          expect(err.get('aNumber')[0].message).to.equal('Validation isInt on aNumber failed');
        })
    );

    it('should fail a validation upon creating with hooks false', () =>
      User
        .create({aNumber: 'hello' as any}, {hooks: false} as any)
        .catch((err) => {
          expect(err).to.exist;
          expect(err).to.be.instanceof(Object);
          expect(err.get('aNumber')).to.be.instanceof(Array);
          expect(err.get('aNumber')[0]).to.exist;
          expect(err.get('aNumber')[0].message).to.equal('Validation isInt on aNumber failed');
        })
    );

    it('should fail a validation upon building', () =>
      User
        .build({aNumber: 0, username: 'aaaaaaaaaaaaaaaaaaaaaaaaaa'})
        .save()
        .catch((err) => {
          expect(err).to.exist;
          expect(err).to.be.instanceof(Object);
          expect(err.get('username')).to.exist;
          expect(err.get('username')).to.be.instanceof(Array);
          expect(err.get('username')[0]).to.exist;
          expect(err.get('username')[0].message).to.equal('Validation len on username failed');
        })
    );

    it('should fail a validation when updating', () =>
      User
        .create({aNumber: 0})
        .then((user) => user.update({aNumber: 'hello' as any}))
        .catch((err) => {
          expect(err).to.exist;
          expect(err).to.be.instanceof(Object);
          expect(err.get('aNumber')).to.exist;
          expect(err.get('aNumber')).to.be.instanceof(Array);
          expect(err.get('aNumber')[0]).to.exist;
          expect(err.get('aNumber')[0].message).to.equal('Validation isInt on aNumber failed');
        })
    );

    it('takes zero into account', () =>
      User
        .build({aNumber: 0})
        .save({fields: ['aNumber']})
        .then((user) => {
          expect(user.aNumber).to.equal(0);
        })
    );

    it('saves a record with no primary key', () => {
      @Table
      class HistoryLog extends Model<HistoryLog> {

        @Column
        someText: string;

        @Column
        aNumber: number;

        @Column
        aRandomId: number;
      }

      sequelize.addModels([HistoryLog]);

      return HistoryLog
        .sync()
        .then(() => HistoryLog.create({someText: 'Some random text', aNumber: 3, aRandomId: 5}))
        .then((log) => log.update({aNumber: 5}))
        .then((newLog) => {
          expect(newLog.aNumber).to.equal(5);
        });
    });

    describe('eagerly loaded objects', () => {

      @Table
      class UserEager extends Model<UserEager> {

        @Column
        username: string;

        @Column
        age: number;

        @HasMany(() => ProjectEager)
        projects: ProjectEager[];
      }

      @Table
      class ProjectEager extends Model<ProjectEager> {

        @Column
        title: string;

        @Column
        overdueDays: number;

        @ForeignKey(() => UserEager)
        @Column
        poobahId: number;

        @BelongsTo(() => UserEager)
        poobah: UserEager;
      }

      before(() => sequelize.addModels([UserEager, ProjectEager]));

      beforeEach(() => UserEager.sync({force: true}).then(() => ProjectEager.sync({force: true})));

      it('saves one object that has a collection of eagerly loaded objects', () =>
        UserEager
          .create({username: 'joe', age: 1})
          .then((user) => ProjectEager.create({title: 'project-joe1', overdueDays: 0})
            .then((project1) => ProjectEager.create({title: 'project-joe2', overdueDays: 0})
              .then((project2) => user.$set('projects', [project1, project2]))
              .then(() => UserEager.findOne({where: {age: 1}, include: [ProjectEager]}))
              .then((_user) => {
                expect(_user.username).to.equal('joe');
                expect(_user.age).to.equal(1);
                expect(_user.projects).to.exist;
                expect(_user.projects.length).to.equal(2);

                _user.age = _user.age + 1; // happy birthday joe
                return _user.save();
              })
              .then((_user) => {
                expect(_user.username).to.equal('joe');
                expect(_user.age).to.equal(2);
                expect(_user.projects).to.exist;
                expect(_user.projects.length).to.equal(2);
              })
            )
          )
      );

      it('saves many objects that each a have collection of eagerly loaded objects', () =>

        Promise
          .props({
            bart: UserEager.create({username: 'bart', age: 20}),
            lisa: UserEager.create({username: 'lisa', age: 20}),
            detention1: ProjectEager.create({title: 'detention1', overdueDays: 0}),
            detention2: ProjectEager.create({title: 'detention2', overdueDays: 0}),
            exam1: ProjectEager.create({title: 'exam1', overdueDays: 0}),
            exam2: ProjectEager.create({title: 'exam2', overdueDays: 0})
          })
          .then(({bart, lisa, detention1, detention2, exam1, exam2}) =>
            Promise
              .all([
                bart.$set('projects', [detention1, detention2]),
                lisa.$set('projects', [exam1, exam2])
              ])
              .then(() => UserEager.findAll({
                where: {age: 20},
                order: [['username', 'ASC']],
                include: [ProjectEager]
              }))
              .then((simpsons) => {
                let _bart;
                let _lisa;

                expect(simpsons.length).to.equal(2);

                _bart = simpsons[0];
                _lisa = simpsons[1];

                expect(_bart.projects).to.exist;
                expect(_lisa.projects).to.exist;
                expect(_bart.projects.length).to.equal(2);
                expect(_lisa.projects.length).to.equal(2);

                _bart.age = _bart.age + 1; // happy birthday bart - off to Moe's
                _lisa.username = 'lsimpson';

                return Promise.all([
                  _bart.save(),
                  _lisa.save()
                ]);
              })
              .then(([savedBart, savedLisa]) => {

                expect(savedBart.username).to.equal('bart');
                expect(savedBart.age).to.equal(21);

                expect(savedLisa.username).to.equal('lsimpson');
                expect(savedLisa.age).to.equal(20);
              })
          )
      );

      it('saves many objects that each has one eagerly loaded object (to which they belong)', () =>

        Promise
          .all([
            UserEager.create({username: 'poobah', age: 18}),
            ProjectEager.create({title: 'homework', overdueDays: 10}),
            ProjectEager.create({title: 'party', overdueDays: 2})
          ])
          .then(([user, homework, party]) => user.$set('projects', [homework, party]))
          .then(() => ProjectEager.findAll({
            include: [{
              model: UserEager,
              as: 'poobah'
            }]
          }))
          .then((projects) => {
            expect(projects.length).to.equal(2);
            expect(projects[0].poobah).to.exist;
            expect(projects[1].poobah).to.exist;
            expect(projects[0].poobah).to.have.property('username', 'poobah');
            expect(projects[1].poobah).to.have.property('username', 'poobah');

            projects[0].title = 'partymore';
            projects[1].title = 'partymore';
            projects[0].overdueDays = 0;
            projects[1].overdueDays = 0;

            return Promise.all([
              projects[0].save(),
              projects[1].save()
            ]);
          })
          .then(() => ProjectEager.findAll({
            where: {title: 'partymore', overdueDays: 0},
            include: [UserEager]
          }))
          .then((savedprojects) => {

            expect(savedprojects.length).to.equal(2);
            expect(savedprojects[0].poobah).to.exist;
            expect(savedprojects[1].poobah).to.exist;
            expect(savedprojects[0].poobah).to.have.property('username', 'poobah');
            expect(savedprojects[1].poobah).to.have.property('username', 'poobah');
          })
      );
    });
  });

  describe('toJSON', () => {

    @Table
    class NiceUser extends Model<NiceUser> {

      @Column
      username: string;

      @Column
      age: number;

      @Column
      isAdmin: boolean;

      @HasMany(() => NiceProject)
      projects: NiceProject[];
    }

    @Table
    class NiceProject extends Model<NiceProject> {

      @Column
      title: string;

      @ForeignKey(() => NiceUser)
      @Column
      userId: number;

      @BelongsTo(() => NiceUser)
      user: NiceUser;
    }

    before(() => sequelize.addModels([NiceUser, NiceProject]));

    beforeEach(() => NiceUser.sync({force: true}).then(() => NiceProject.sync({force: true})));

    it("dont return instance that isn't defined", () =>

      NiceProject
        .create({user: null})
        .then((project) =>
          NiceProject.findOne({
            where: {
              id: project.id
            },
            include: [
              {model: NiceUser, as: 'user'}
            ]
          })
        )
        .then((project) => {
          const json = project.toJSON() as NiceProject;
          expect(json.user).to.be.equal(null);
        })
    );

    it("dont return instances that aren't defined", () =>

      NiceUser
        .create({username: 'cuss'})
        .then((user) =>
          NiceUser.findOne({
            where: {
              id: user.id
            },
            include: [NiceProject]
          })
        )
        .then((user) => {
          expect(user.projects).to.be.instanceof(Array);
          expect(user.projects).to.be.length(0);
        })
    );

    it('returns an object containing all values', () => {
      const user = NiceUser.build({username: 'test.user', age: 99, isAdmin: true});
      expect(user.toJSON()).to.deep.equal({username: 'test.user', age: 99, isAdmin: true, id: null});
    });

    it('returns an object containing all values (created with new)', () => {
      const user = new NiceUser({username: 'test.user', age: 99, isAdmin: true});
      expect(user.toJSON()).to.deep.equal({username: 'test.user', age: 99, isAdmin: true, id: null});
    });

    it('returns a response that can be stringified', () => {
      const user = NiceUser.build({username: 'test.user', age: 99, isAdmin: true});
      expect(JSON.stringify(user)).to.deep.equal('{"id":null,"username":"test.user","age":99,"isAdmin":true}');
    });

    it('returns a response that can be stringified (created with new)', () => {
      const user = new NiceUser({username: 'test.user', age: 99, isAdmin: true});
      expect(JSON.stringify(user)).to.deep.equal('{"id":null,"username":"test.user","age":99,"isAdmin":true}');
    });

    it('returns a response that can be stringified and then parsed', () => {
      const user = NiceUser.build({username: 'test.user', age: 99, isAdmin: true});
      expect(JSON.parse(JSON.stringify(user))).to.deep.equal({
        username: 'test.user',
        age: 99,
        isAdmin: true,
        id: null
      });
    });

    it('returns a response that can be stringified and then parsed (created with new)', () => {
      const user = new NiceUser({username: 'test.user', age: 99, isAdmin: true});
      expect(JSON.parse(JSON.stringify(user))).to.deep.equal({
        username: 'test.user',
        age: 99,
        isAdmin: true,
        id: null
      });
    });

    it('includes the eagerly loaded associations', () =>

      Promise
        .all([
          NiceUser.create({username: 'fnord', age: 1, isAdmin: true}),
          NiceProject.create({title: 'fnord'})
        ])
        .then(([user, project]) => user.$set('projects', [project]))
        .then(() =>
          Promise.all([
            NiceUser.findAll({include: [NiceProject]}),
            NiceProject.findAll({include: [NiceUser]})
          ])
        )
        .then(([users, projects]) => {
          const user = users[0];
          const project = projects[0];

          expect(user.projects).to.exist;
          expect(JSON.parse(JSON.stringify(user)).projects).to.exist;

          expect(project.user).to.exist;
          expect(JSON.parse(JSON.stringify(project)).user).to.exist;
        })
    );
  });

  describe('findAll', () => {

    @Table({timestamps: true, paranoid: true})
    class ParanoidUser extends Model<ParanoidUser> {

      @Column
      username: string;

      @ForeignKey(() => ParanoidUser)
      @Column
      paranoidUserId: number;

      @HasOne(() => ParanoidUser)
      paranoidUser: ParanoidUser;
    }

    before(() => sequelize.addModels([ParanoidUser]));

    beforeEach(() => ParanoidUser.sync({force: true}));

    it('sql should have paranoid condition', () =>

      ParanoidUser.create({username: 'cuss'})
        .then(() => ParanoidUser.findAll())
        .then((users) => {
          expect(users).to.have.length(1);
          return users[0].destroy();
        })
        .then(() => ParanoidUser.findAll())
        .then((users) => {
          expect(users).to.have.length(0);
        })
    );

    it('sequelize.and as where should include paranoid condition', () =>

      ParanoidUser.create({username: 'cuss'})
        .then(() =>
          ParanoidUser.findAll({
            where: Sequelize.and({username: 'cuss'})
          })
        )
        .then((users) => {
          expect(users).to.have.length(1);
          return users[0].destroy();
        })
        .then(() =>
          ParanoidUser.findAll({
            where: Sequelize.and({username: 'cuss'})
          })
        )
        .then((users) => {
          expect(users).to.have.length(0);
        })
    );

    it('sequelize.or as where should include paranoid condition', () =>

      ParanoidUser.create({username: 'cuss'})
        .then(() =>
          ParanoidUser.findAll({
            where: Sequelize.or({username: 'cuss'})
          })
        )
        .then((users) => {
          expect(users).to.have.length(1);
          return users[0].destroy();
        })
        .then(() =>
          ParanoidUser.findAll({
            where: Sequelize.or({username: 'cuss'})
          })
        )
        .then((users) => {
          expect(users).to.have.length(0);
        })
    );

    it('escapes a single single quotes properly in where clauses', () =>

      User
        .create({username: "user'name"})
        .then(() => User.findAll({where: {username: "user'name"}}))
        .then((users) => {
          expect(users.length).to.equal(1);
          expect(users[0].username).to.equal("user'name");
        })
    );

    it('escapes two single quotes properly in where clauses', () =>

      User
        .create({username: "user''name"})
        .then(() => User.findAll({where: {username: "user''name"}}))
        .then((users) => {
          expect(users.length).to.equal(1);
          expect(users[0].username).to.equal("user''name");
        })
    );

    it('returns the timestamps if no attributes have been specified', () =>

      TimeStampsUser.create({username: 'fnord'})
        .then(() => TimeStampsUser.findAll())
        .then((users) => {
          expect(users[0].createdAt).to.exist;
        })
    );

    it('does not return the timestamps if the username attribute has been specified', () =>

      User.create({username: 'fnord'})
        .then(() => User.findAll({attributes: ['username']}))
        .then((users) => {
          expect(users[0].createdAt).not.to.exist;
          expect(users[0].username).to.exist;
        })
    );

    it('creates the deletedAt property, when defining paranoid as true', () =>

      ParanoidUser.create({username: 'fnord'})
        .then(() => ParanoidUser.findAll())
        .then((users) => {
          expect(users[0].deletedAt).to.be.null;
        })
    );

    it('destroys a record with a primary key of something other than id', () => {

      @Table
      class UserDestroy extends Model<UserDestroy> {

        @PrimaryKey
        @Column
        newId: string;

        @Column
        email: string;
      }

      sequelize.addModels([UserDestroy]);

      return UserDestroy.sync().then(() => {
        return UserDestroy.create({newId: '123ABC', email: 'hello'}).then(() => {
          return UserDestroy.findOne({where: {email: 'hello'}}).then((user) => {
            return user.destroy();
          });
        });
      });
    });

    it('sets deletedAt property to a specific date when deleting an instance', () =>

      ParanoidUser.create({username: 'fnord'}).then(() => {
        return ParanoidUser.findAll().then((users) => {
          return users[0].destroy().then(() => {
            expect(users[0].deletedAt.getMonth).to.exist;

            return users[0].reload({paranoid: false}).then((user) => {
              expect(user.deletedAt.getMonth).to.exist;
            });
          });
        });
      })
    );

    it('keeps the deletedAt-attribute with value null, when running update', () =>

      ParanoidUser.create({username: 'fnord'}).then(() => {
        return ParanoidUser.findAll().then((users) => {
          return users[0].update({username: 'newFnord'}).then((user) => {
            expect(user.deletedAt).not.to.exist;
          });
        });
      })
    );

    it('keeps the deletedAt-attribute with value null, when updating associations', () =>

      ParanoidUser.create({username: 'fnord'}).then(() => {
        return ParanoidUser.findAll().then((users) => {
          return ParanoidUser.create({username: 'linkedFnord'}).then((linkedUser) => {
            return users[0].$set('paranoidUser', linkedUser).then((user: ParanoidUser) => {
              expect(user.deletedAt).not.to.exist;
            });
          });
        });
      })
    );

    it('can reuse query option objects', () =>

      User.create({username: 'fnord'}).then(() => {
        const query = {where: {username: 'fnord'}};
        return User.findAll(query).then((users) => {
          expect(users[0].username).to.equal('fnord');
          return User.findAll(query).then((_users) => {
            expect(_users[0].username).to.equal('fnord');
          });
        });
      })
    );
  });

  describe('find', () => {

    it('can reuse query option objects', () =>

      User.create({username: 'fnord'}).then(() => {
        const query = {where: {username: 'fnord'}};
        return User.findOne(query).then((user) => {
          expect(user.username).to.equal('fnord');
          return User.findOne(query).then((_user) => {
            expect(_user.username).to.equal('fnord');
          });
        });
      })
    );

    it('returns null for null, undefined, and unset boolean values', () => {

      @Table({logging: true} as TableOptions)
      class Setting extends Model<Setting> {

        @Column
        settingKey: string;

        @AllowNull
        @Column
        boolValue: boolean;

        @AllowNull
        @Column
        boolValue2: boolean;

        @AllowNull
        @Column
        boolValue3: boolean;
      }

      sequelize.addModels([Setting]);

      return Setting.sync({force: true}).then(() => {
        return Setting.create({settingKey: 'test', boolValue: null, boolValue2: undefined}).then(() => {
          return Setting.findOne({where: {settingKey: 'test'}}).then((setting) => {
            expect(setting.boolValue).to.equal(null);
            expect(setting.boolValue2).to.equal(null);
            expect(setting.boolValue3).to.equal(null);
          });
        });
      });
    });
  });

  describe('equals', () => {

    it('can compare records with Date field', () =>

      User.create({username: 'fnord'}).then((user1) =>
        User.findOne({where: {username: 'fnord'}}).then((user2) => {
          expect(user1.equals(user2)).to.be.true;
        })
      )
    );

    it('does not compare the existence of associations', () => {

      @Table
      class UserAssociationEqual extends Model<UserAssociationEqual> {

        @Column
        username: string;

        @HasMany(() => ProjectAssociationEqual)
        projects: ProjectAssociationEqual[];

      }

      @Table
      class ProjectAssociationEqual extends Model<ProjectAssociationEqual> {

        @Column
        title: string;

        @Column
        overdueDays: number;

        @ForeignKey(() => UserAssociationEqual)
        @Column
        userId: number;

        @BelongsTo(() => UserAssociationEqual)
        user: UserAssociationEqual;
      }

      sequelize.addModels([UserAssociationEqual, ProjectAssociationEqual]);

      return UserAssociationEqual.sync({force: true})
        .then(() => ProjectAssociationEqual.sync({force: true}))
        .then(() => Promise.all([
          UserAssociationEqual.create({username: 'jimhalpert'}),
          ProjectAssociationEqual.create({title: 'A Cool Project'})
        ]))
        .then(([user1, project1]) => user1.$set('projects', [project1])
          .then(() =>
            Promise.all([
              UserAssociationEqual.findOne({
                where: {username: 'jimhalpert'},
                include: [ProjectAssociationEqual]
              }),
              UserAssociationEqual.create({username: 'pambeesly'})
            ])
          )
          .then(([user2, user3]) => {

            expect(user1.get('projects')).to.not.exist;
            expect(user2.get('projects')).to.exist;
            expect(user1.equals(user2)).to.be.true;
            // expect(user2.equals(user1)).to.be.true; TODO@robin does not work with classic define either - so whats wrong?
            expect(user1.equals(user3)).to.not.be.true;
            expect(user3.equals(user1)).to.not.be.true;
          })
        );
    });
  });

  describe('values', () => {

    it('returns all values', () => {

      @Table({logging: false} as TableOptions)
      class UserHelper extends Model<UserHelper> {

        @Column
        username: string;

        @Column
        email: string;
      }

      sequelize.addModels([UserHelper]);

      return UserHelper.sync().then(() => {
        const user = UserHelper.build({username: 'foo'});
        expect(user.get({plain: true})).to.deep.equal({username: 'foo', id: null});
      });
    });
  });

  describe('destroy', () => {
    // TODO@robin sqlite3 transaction issue??
    // if (current.dialect.supports.transactions) {
    //   it('supports transactions', () => {
    //     return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
    //       var User = sequelize.define('User', {username: Support.Sequelize.STRING});
    //
    //       return User.sync({force: true}).then(() => {
    //         return User.create({username: 'foo'}).then((user) => {
    //           return sequelize.transaction().then((t) => {
    //             return user.destroy({transaction: t}).then(() => {
    //               return User.count().then((count1) => {
    //                 return User.count({transaction: t}).then((count2) => {
    //                   expect(count1).to.equal(1);
    //                   expect(count2).to.equal(0);
    //                   return t.rollback();
    //                 });
    //               });
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // }

    it('does not set the deletedAt date in subsequent destroys if dao is paranoid', () => {

      @Table({timestamps: true, paranoid: true})
      class UserDestroy extends Model<UserDestroy> {

        @Column
        name: string;

        @Column(DataType.TEXT)
        bio: string;
      }

      sequelize.addModels([UserDestroy]);

      return UserDestroy.sync({force: true}).then(() => {
        return UserDestroy.create({name: 'hallo', bio: 'welt'}).then((user) => {
          return user.destroy().then(() => {
            return user.reload({paranoid: false}).then(() => {
              const deletedAt = user.deletedAt;

              return user.destroy().then(() => {
                return user.reload({paranoid: false}).then(() => {
                  expect(user.deletedAt).to.eql(deletedAt);
                });
              });
            });
          });
        });
      });
    });

    it('deletes a record from the database if dao is not paranoid', () => {
      @Table
      class UserDestroy extends Model<UserDestroy> {

        @Column
        name: string;

        @Column(DataType.TEXT)
        bio: string;
      }

      sequelize.addModels([UserDestroy]);

      return UserDestroy.sync({force: true}).then(() => {
        return UserDestroy.create({name: 'hallo', bio: 'welt'}).then((u) => {
          return UserDestroy.findAll().then((users) => {
            expect(users.length).to.equal(1);
            return u.destroy().then(() => {
              return UserDestroy.findAll().then((_users) => {
                expect(_users.length).to.equal(0);
              });
            });
          });
        });
      });
    });

    it('allows sql logging of delete statements', () => {
      @Table({paranoid: true})
      class UserDelete extends Model<UserDelete> {

        @Column
        name: string;

        @Column(DataType.TEXT)
        bio: string;
      }

      sequelize.addModels([UserDelete]);

      return UserDelete.sync({force: true}).then(() => {
        return UserDelete.create({name: 'hallo', bio: 'welt'}).then((u) => {
          return UserDelete.findAll().then((users) => {
            expect(users.length).to.equal(1);
            return u.destroy({
              logging(sql: string): void {
                expect(sql).to.exist;
                expect(sql.toUpperCase().indexOf('DELETE')).to.be.above(-1);
              }
            });
          });
        });
      });
    });

    it('delete a record of multiple primary keys table', () => {
      @Table
      class MultiPrimary extends Model<MultiPrimary> {

        @PrimaryKey
        @Column(DataType.CHAR(2))
        bilibili: string;

        @PrimaryKey
        @Column(DataType.CHAR(2))
        guruguru: string;
      }

      sequelize.addModels([MultiPrimary]);

      return MultiPrimary.sync({force: true}).then(() => {
        return MultiPrimary.create({bilibili: 'bl', guruguru: 'gu'}).then(() => {
          return MultiPrimary.create({bilibili: 'bl', guruguru: 'ru'}).then((m2) => {
            return MultiPrimary.findAll().then((ms) => {
              expect(ms.length).to.equal(2);
              return m2.destroy({
                logging: (sql) => {
                  expect(sql).to.exist;
                  expect(sql.toUpperCase().indexOf('DELETE')).to.be.above(-1);
                  expect(sql.indexOf('ru')).to.be.above(-1);
                  expect(sql.indexOf('bl')).to.be.above(-1);
                }
              }).then(() => {
                return MultiPrimary.findAll().then((ms3) => {
                  expect(ms3.length).to.equal(1);
                  expect(ms3[0].bilibili).to.equal('bl');
                  expect(ms3[0].guruguru).to.equal('gu');
                });
              });
            });
          });
        });
      });
    });
  });

  describe('restore', () => {

    it('returns an error if the model is not paranoid', () =>

      User.create({username: 'Peter'}).then((user) =>
        expect(() => user.restore()).to.throw(Error, 'Model is not paranoid')
      )
    );

    it('restores a previously deleted model', () => {

      @Table({timestamps: true, paranoid: true})
      class ParanoidUser2 extends Model<ParanoidUser2> {

        @Column
        username: string;

        @Column
        secretValue: string;

        @Column
        data: string;

        @Default(1)
        @Column
        inVal: number;
      }

      sequelize.addModels([ParanoidUser2]);

      const data = [{username: 'Peter', secretValue: '42'},
        {username: 'Paul', secretValue: '43'},
        {username: 'Bob', secretValue: '44'}];

      return ParanoidUser2.sync({force: true}).then(() => {
        return ParanoidUser2.bulkCreate(data);
      }).then(() => {
        return ParanoidUser2.findOne({where: {secretValue: '42'}});
      }).then((user) => {
        return user.destroy().then(() => {
          return user.restore();
        });
      }).then(() => {
        return ParanoidUser2.findOne({where: {secretValue: '42'}});
      }).then((user) => {
        expect(user).to.be.ok;
        expect(user.username).to.equal('Peter');
      });
    });
  });

})
;
