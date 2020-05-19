/* tslint:disable:max-classes-per-file */

import {expect, use} from 'chai';
import {useFakeTimers, stub, spy} from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Op, UniqueConstraintError} from 'sequelize';
import * as chaiAsPromised from 'chai-as-promised';
import {createSequelize} from "../utils/sequelize";
import {
  Model, Table, Column, PrimaryKey,
  ForeignKey, HasMany, BelongsTo, DataType, Default,
  AutoIncrement, CreatedAt, DeletedAt, UpdatedAt,
  BelongsToMany
} from "../../src";
import chaiDatetime = require('chai-datetime');
import {TableOptions} from "../../src/model/table/table-options";

use(sinonChai);
use(chaiAsPromised);
use(chaiDatetime);

let clock;

describe('model', () => {

  let sequelize;

  @Table
  class MainUser extends Model<MainUser> {

    @Column
    username: string;

    @Column
    secretValue: string;

    @Column
    data: string;

    @Column
    intVal: number;

    @Column
    theDate: Date;

    @Column
    aBool: boolean;
  }

  before(() => {
    clock = useFakeTimers();
  });

  after(() => {
    clock.restore();
  });

  beforeEach(() => {
    sequelize = createSequelize();
    sequelize.addModels([MainUser]);
    return MainUser.sync({force: true});
  });

  describe('instantiation when not initialized', () => {

    it('should throw an error', () => {
      @Table
      class Test extends Model<Test> {
      }

      expect(() => new Test()).to.throw(/^Model not initialized/);
    });

  });

  describe('static functions when not initialized', () => {

    it('should throw an error', () => {
      @Table
      class Test extends Model<Test> {
      }

      expect(() => Test.beforeCreate(() => {
      })).to.throw(/^Model not initialized/);
    });

  });

  describe('constructor', () => {
    it('uses the passed dao name as tablename if freezeTableName', () => {

      @Table({freezeTableName: true, tableName: 'FrozenUser'})
      class User extends Model<User> {
      }

      sequelize.addModels([User]);

      expect(User['tableName']).to.equal('FrozenUser');
    });

    it('uses the pluralized dao name as tablename unless freezeTableName', () => {
      @Table({freezeTableName: false, tableName: 'SuperUser'})
      class User extends Model<User> {
      }

      sequelize.addModels([User]);

      expect(User['tableName']).to.equal('SuperUser');
    });

    it('uses checks to make sure dao factory isnt leaking on multiple define', () => {

      (() => {
        @Table({freezeTableName: false, tableName: 'SuperUser'})
        class User extends Model<User> {
        }

        sequelize.addModels([User]);
      })();

      const factorySize = sequelize['modelManager'].all.length;

      (() => {
        @Table({freezeTableName: false, tableName: 'SuperUser'})
        class User extends Model<User> {
        }

        sequelize.addModels([User]);
      })();
      const factorySize2 = sequelize['modelManager'].all.length;

      expect(factorySize).to.equal(factorySize2);
    });

    it('allows us us to predefine the ID column with our own specs', () => {
      @Table
      class User extends Model<User> {
        @PrimaryKey
        @Default('User')
        @Column
        id: string;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return expect(User.create({id: 'My own ID!'})).to.eventually.have.property('id', 'My own ID!');
      });
    });

    it('throws an error if 2 autoIncrements are passed', () => {
      expect(() => {
        @Table
        class User extends Model<User> {
          @PrimaryKey
          @AutoIncrement
          @Column
          id: string;

          @PrimaryKey
          @AutoIncrement
          @Column
          id2: string;
        }

        sequelize.addModels([User]);
      }).to.throw(Error, 'Invalid Instance definition. Only one autoincrement field allowed.');
    });

    // TODO@robin not throwing, but should: looks good on sequelize-typescript side, so whats wrong?
    // it('throws an error if a custom model-wide validation is not a function', () => {
    //   expect(() => {
    //     @Table
    //     class User extends Model<User> {
    //       @Column({
    //         validate: {
    //           notFunction: 33
    //         }
    //       })
    //       field: string;
    //     }
    //     sequelize.addModels([User]);
    //   }).to.throw(Error, 'Members of the validate option must be functions. Model: Foo, error with validate member notFunction');
    // });
    //
    // it('throws an error if a custom model-wide validation has the same name as a field', () => {
    //   expect(() => {
    //     @Table
    //     class User extends Model<User> {
    //       @Column({
    //         validate: {
    //           field: () => null
    //         }
    //       })
    //       field: string;
    //     }
    //     sequelize.addModels([User]);
    //   }).to.throw(Error, 'A model validator function must not have the same name as a field. Model: Foo, field/validation name: field');
    // });

    it('should allow me to set a default value for createdAt and updatedAt', () => {
      clock.restore();

      @Table({timestamps: true})
      class User extends Model<User> {
        @Column
        aNumber: number;

        @Default(moment('2012-01-01').toDate())
        @Column
        createdAt: Date;

        @Default(moment('2012-01-02').toDate())
        @Column
        updatedAt: Date;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return User.create({aNumber: 5}).then((user) => {
          clock.restore();
          return User.bulkCreate([
            {aNumber: 10},
            {aNumber: 12}
          ]).then(() => {
            return User.findAll({where: {aNumber: {[Op.gte]: 10}}}).then((users) => {
              expect(moment(user.createdAt).format('YYYY-MM-DD')).to.equal('2012-01-01');
              expect(moment(user.updatedAt).format('YYYY-MM-DD')).to.equal('2012-01-02');
              users.forEach((u) => {
                expect(moment(u.createdAt).format('YYYY-MM-DD')).to.equal('2012-01-01');
                expect(moment(u.updatedAt).format('YYYY-MM-DD')).to.equal('2012-01-02');
              });
            });
          });
        });
      });
    });

    it('should allow me to set a function as default value', () => {
      const defaultFunction = stub().returns(5);

      @Table({timestamps: true})
      class User extends Model<User> {
        @Default(defaultFunction)
        @Column
        aNumber: number;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return User.create().then((user) => {
          return User.create().then((user2) => {
            expect(user.aNumber).to.equal(5);
            expect(user2.aNumber).to.equal(5);
            expect(defaultFunction.callCount).to.equal(2);
          });
        });
      });
    });

    it('should allow me to override updatedAt, createdAt, and deletedAt fields', () => {
      @Table
      class User extends Model<User> {
        @Column
        aNumber: number;

        @UpdatedAt
        updatedOn: Date;

        @CreatedAt
        dateCreated: Date;

        @DeletedAt
        deletedAtThisTime: Date;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return User.create({aNumber: 4}).then((user) => {
          expect(user.updatedOn).to.exist;
          expect(user.dateCreated).to.exist;
          return user.destroy().then(() => {
            return user.reload({paranoid: false}).then(() => {
              expect(user.deletedAtThisTime).to.exist;
            });
          });
        });
      });
    });

    it('should allow me to disable some of the timestamp fields', () => {
      @Table({updatedAt: false, createdAt: false})
      class User extends Model<User> {
        @Column
        name: string;

        @DeletedAt
        deletedAtThisTime: Date;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return User.create({
          name: 'heyo'
        }).then((user) => {
          expect(user.createdAt).not.to.exist;
          expect(user['false']).not.to.exist; //  because, you know we might accidentally add a field named 'false'

          user.name = 'heho';
          return user.save().then((_user) => {
            expect(_user.updatedAt).not.to.exist;
            return _user.destroy().then(() => {
              return _user.reload({paranoid: false}).then(() => {
                expect(_user.deletedAtThisTime).to.exist;
              });
            });
          });
        });
      });
    });

    it('returns proper defaultValues after save when setter is set', () => {
      const titleSetter = spy();

      @Table({updatedAt: false, createdAt: false})
      class Task extends Model<Task> {
        @Column({
          type: DataType.STRING(50),
          allowNull: false,
          defaultValue: '',
          set: titleSetter
        })
        title: string;

        @DeletedAt
        deletedAtThisTime: Date;
      }

      sequelize.addModels([Task]);

      return Task.sync({force: true}).then(() => {
        return Task.build().save().then((record) => {
          expect(record.title).to.be.a('string');
          expect(record.title).to.equal('');
          expect(titleSetter.notCalled).to.be.ok; // The setter method should not be invoked for default values
        });
      });
    });

    it('should work with both paranoid and underscored being true', () => {
      @Table({paranoid: true, underscored: true})
      class User extends Model<User> {
        @Column
        aNumber: number;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return User.create({aNumber: 30}).then(() => {
          return User.count().then((c) => {
            expect(c).to.equal(1);
          });
        });
      });
    });

    it('allows multiple column unique keys to be defined', () => {
      @Table
      class User extends Model<User> {

        @Column({
          unique: 'user_and_email'
        })
        username: string;

        @Column({
          unique: 'user_and_email'
        })
        email: string;

        @Column({
          unique: 'a_and_b'
        })
        aCol: string;

        @Column({
          unique: 'a_and_b'
        })
        bCol: string;
      }

      sequelize.addModels([User]);

      return User.sync({
        force: true, logging: _.after(2, _.once((sql) => {
          expect(sql).to.match(/UNIQUE\s*([`"]?user_and_email[`"]?)?\s*\([`"]?username[`"]?, [`"]?email[`"]?\)/);
          expect(sql).to.match(/UNIQUE\s*([`"]?a_and_b[`"]?)?\s*\([`"]?aCol[`"]?, [`"]?bCol[`"]?\)/);
        }))
      });
    });

    it('allows unique on column with field aliases', () => {
      @Table
      class User extends Model<User> {

        @Column({
          field: 'user_name',
          unique: 'user_name_unique'
        })
        username: string;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return sequelize['queryInterface'].showIndex(User['tableName']).then((indexes) => {
          expect(indexes).to.have.length(1);
          const idxUnique = indexes[0];
          expect(idxUnique.primary).to.equal(false);
          expect(idxUnique.unique).to.equal(true);
          expect(idxUnique.fields).to.deep.equal([{attribute: 'user_name', length: undefined, order: undefined}]);
        });
      });
    });

    it('allows us to customize the error message for unique constraint', () => {

      @Table
      class User extends Model<User> {

        @Column({
          unique: {name: 'user_and_email', msg: 'User and email must be unique'}
        })
        username: string;

        @Column({
          unique: 'user_and_email'
        })
        email: string;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        return Promise.all([
          User.create({username: 'tobi', email: 'tobi@tobi.me'}),
          User.create({username: 'tobi', email: 'tobi@tobi.me'})]);
      }).catch((err) => {
        expect(err.message).to.equal('User and email must be unique');
      });
    });

    // If you use migrations to create unique indexes that have explicit names and/or contain fields
    // that have underscore in their name. Then sequelize must use the index name to map the custom message to the error thrown from db.
    it('allows us to map the customized error message with unique constraint name', () => {
      // Fake migration style index creation with explicit index definition
      @Table({
        timestamps: true,
        indexes: [
          {
            name: 'user_and_email_index',
            unique: true,
            fields: ['userId', {
              name: 'email',
              collate: 'RTRIM',
              order: 'DESC',
              length: 5,
            }]
          }
        ]
      })
      class User extends Model<User> {

        @Column
        userId: number;

        @Column
        email: string;
      }

      sequelize.addModels([User]);

      return User.sync({force: true}).then(() => {
        // Redefine the model to use the index in database and override error message
        @Table({timestamps: true})
        class User extends Model<User> {

          @Column({
            unique: {name: 'user_and_email_index', msg: 'User and email must be unique'}
          })
          userId: number;

          @Column({
            unique: 'user_and_email_index'
          })
          email: string;
        }

        sequelize.addModels([User]);

        return Promise.all([
          User.create({userId: 1, email: 'tobi@tobi.me'}),
          User.create({userId: 1, email: 'tobi@tobi.me'})]);
      }).catch((err) => {
        expect(err.message).to.equal('User and email must be unique');
      });
    });

    it('should allow the user to specify indexes in options', () => {

      @Table({
        indexes: [{
          name: 'a_b_uniq',
          unique: true,
          method: 'BTREE',
          fields: ['fieldB', {
            attribute: 'fieldA',
            collate: 'RTRIM',
            order: 'DESC',
            length: 5
          }]
        }, {
          type: 'FULLTEXT',
          fields: ['fieldC'],
          concurrently: true
        }, {
          type: 'FULLTEXT',
          fields: ['fieldD']
        }],
        engine: 'MyISAM'
      } as TableOptions)
      class ModelA extends Model<ModelA> {
        @Column
        fieldA: string;
        @Column
        fieldB: number;
        @Column
        fieldC: string;
        @Column
        fieldD: string;
      }

      sequelize.addModels([ModelA]);

      return sequelize.sync().then(() => {
        return sequelize.sync(); // The second call should not try to create the indices again
      }).then(() => {
        return sequelize['queryInterface'].showIndex(ModelA['tableName']);
      }).then(([idx1, idx2]) => {

        expect(idx1.fields).to.deep.equal([
          {attribute: 'fieldB', length: undefined, order: undefined},
          {attribute: 'fieldA', length: undefined, order: undefined}
        ]);

        expect(idx2.fields).to.deep.equal([
          {attribute: 'fieldC', length: undefined, order: undefined}
        ]);

        expect(idx1.name).to.equal('a_b_uniq');
        expect(idx1.unique).to.be.ok;


        expect(idx2.name).to.equal('model_as_field_c');
        expect(idx2.unique).not.to.be.ok;

      });
    });
  });

  describe('build using new', () => {

    it('should create an instance of defined model', () => {
      const name = 'test';

      @Table
      class User extends Model<User> {
        @Column name: string;
      }

      sequelize.addModels([User]);
      const user = new User({name});

      expect(user).to.be.an.instanceOf(User);
      expect(user).to.have.property('name', name);
    });

  });

  describe('build', () => {
    it("doesn't create database entries", () => {
      MainUser.build({username: 'John Wayne'});
      return MainUser.findAll().then((users) => {
        expect(users).to.have.length(0);
      });
    });

    it('fills the objects with default values (timestamps=true)', () => {
      @Table({timestamps: true})
      class Task extends Model<Task> {

        @Default('a task!')
        @Column
        title: string;

        @Default(2)
        @Column
        foo: number;

        @Column
        bar: Date;

        @Default('asd')
        @Column(DataType.TEXT)
        foobar: string;

        @Default(false)
        @Column
        flag: boolean;
      }

      sequelize.addModels([Task]);

      expect(Task.build().title).to.equal('a task!');
      expect(Task.build().foo).to.equal(2);
      expect(Task.build().bar).to.not.be.ok;
      expect(Task.build().foobar).to.equal('asd');
      expect(Task.build().flag).to.be.false;
    });

    it('fills the objects with default values', () => {
      @Table
      class Task extends Model<Task> {

        @Default('a task!')
        @Column
        title: string;

        @Default(2)
        @Column
        foo: number;

        @Column
        bar: Date;

        @Default('asd')
        @Column(DataType.TEXT)
        foobar: string;

        @Default(false)
        @Column
        flag: boolean;
      }

      sequelize.addModels([Task]);

      expect(Task.build().title).to.equal('a task!');
      expect(Task.build().foo).to.equal(2);
      expect(Task.build().bar).to.not.be.ok;
      expect(Task.build().foobar).to.equal('asd');
      expect(Task.build().flag).to.be.false;
    });

    it('attaches getter and setter methods from attribute definition', () => {
      @Table
      class Product extends Model<Product> {

        @Column({
          get(this: Product): string {
            return 'answer = ' + this.getDataValue('price');
          },
          set(this: Product, value: number): any {
            return this.setDataValue('price', value + 42);
          }
        })
        price: number;
      }

      sequelize.addModels([Product]);

      expect(Product.build({price: 42}).price).to.equal('answer = 84');

      const p = Product.build({price: 1});
      expect(p.price).to.equal('answer = 43');

      p.price = 0;
      expect(p.price).to.equal('answer = 42');
    });

    it('uses get/set accessors', () => {
      @Table
      class Product extends Model<Product> {

        @Column(DataType.INTEGER)
        get priceInCents() {
          return this.getDataValue('priceInCents');
        }

        @Column(DataType.VIRTUAL)
        set price(value: any) {
          this.setDataValue('priceInCents', value * 100);
        }

        get price() {
          return '$' + (this.getDataValue('priceInCents') / 100);
        }
      }

      sequelize.addModels([Product]);

      expect(Product.build({price: 20}).priceInCents).to.equal(20 * 100);
      expect(Product.build({priceInCents: 30 * 100}).price).to.equal('$' + 30);
    });

    describe('include', () => {

      it('should support basic includes', () => {
        @Table
        class Product extends Model<Product> {

          @Column
          title: string;

          @HasMany(() => Tag)
          tags: Tag[];

          @ForeignKey(() => User)
          userId: number;

          @BelongsTo(() => User)
          user: { id: number; firstName: string; lastName: string; products: Product[] }; // why {...} instead of User?
          // with User reference it throws,
          // because of order of classes: User reference
          // does not exist here, when transpiled to es6
          // see transpiled js file for details
          // NOTICE: this wouldn't be a problem if each
          // class is defined in its own file
        }

        @Table
        class Tag extends Model<Tag> {

          id: number;

          @Column
          name: string;

          @ForeignKey(() => Product)
          productId: number;
        }

        @Table
        class User extends Model<User> {

          @Column
          firstName: string;

          @Column
          lastName: string;

          @HasMany(() => Product)
          products: Product[];
        }

        sequelize.addModels([Product, Tag, User]);

        const product = Product.build({
          id: 1,
          title: 'Chair',
          tags: [
            {id: 1, name: 'Alpha'},
            {id: 2, name: 'Beta'}
          ],
          user: {
            id: 1,
            firstName: 'Mick',
            lastName: 'Hansen'
          }
        }, {
          include: [
            User,
            Tag
          ]
        });

        expect(product.tags).to.be.ok;
        expect(product.tags.length).to.equal(2);
        expect(product.tags[0]).to.be.instanceof(Tag);
        expect(product.user).to.be.ok;
        expect(product.user).to.be.instanceof(User);
      });

      it('should support includes with aliases', () => {
        @Table
        class Product extends Model<Product> {

          @Column
          title: string;

          @HasMany(() => Tag)
          categories: Tag[];

          @ForeignKey(() => User)
          userId: number;

          @BelongsToMany(() => User, 'product_followers', 'productId', 'userId')
          followers: User[];
        }

        @Table
        class Tag extends Model<Tag> {

          id: number;

          @Column
          name: string;

          @ForeignKey(() => Product)
          productId: number;
        }

        @Table
        class User extends Model<User> {

          id: number;

          @Column
          firstName: string;

          @Column
          lastName: string;

          @BelongsToMany(() => Product, 'product_followers', 'productId', 'userId')
          following: Product[];
        }

        sequelize.addModels([Product, Tag, User]);

        const product = Product.build({
          id: 1,
          title: 'Chair',
          categories: [
            {id: 1, name: 'Alpha'},
            {id: 2, name: 'Beta'},
            {id: 3, name: 'Charlie'},
            {id: 4, name: 'Delta'}
          ],
          followers: [
            {
              id: 1,
              firstName: 'Mick',
              lastName: 'Hansen'
            },
            {
              id: 2,
              firstName: 'Jan',
              lastName: 'Meier'
            }
          ]
        }, {
          include: [
            {model: User, as: 'followers'},
            {model: Tag, as: 'categories'}
          ]
        });

        expect(product.categories).to.be.ok;
        expect(product.categories.length).to.equal(4);
        expect(product.categories[0]).to.be.instanceof(Tag);
        expect(product.followers).to.be.ok;
        expect(product.followers.length).to.equal(2);
        expect(product.followers[0]).to.be.instanceof(User);
      });
    });
  });

  describe('findOne', () => {
    // TODO@robin sqlite3 transaction issue
    // if (current.dialect.supports.transactions) {
    //   it('supports the transaction option in the first parameter', () => {
    //     return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
    //       const User = sequelize.define('User', {username: Sequelize.STRING, foo: Sequelize.STRING});
    //       return User.sync({force: true}).then(() => {
    //         return sequelize.transaction().then((t) => {
    //           return User.create({username: 'foo'}, {transaction: t}).then(() => {
    //             return User.findOne({where: {username: 'foo'}, transaction: t}).then((user) => {
    //               expect(user).to.not.be.null;
    //               return t.rollback();
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // }

    it('should not fail if model is paranoid and where is an empty array', () => {
      @Table({paranoid: true, timestamps: true})
      class User extends Model<User> {

        @Column
        username: string;
      }

      sequelize.addModels([User]);

      return User.sync({force: true})
        .then(() => {
          return User.create({username: 'A fancy name'});
        })
        .then(() => {
          return User.findOne({where: {}});
        })
        .then((u) => {
          expect(u.username).to.equal('A fancy name');
        });
    });

    it('should filter based on the where clause even if IFindOptions.include is []', () => {
      @Table({paranoid: true, timestamps: true})
      class User extends Model<User> {

        @Column
        username: string;
      }

      sequelize.addModels([User]);

      return User.sync({force: true})
        .then(() => {
          return User.create({username: 'a1'});
        })
        .then(() => {
          return User.create({username: 'a2'});
        })
        .then(() => {
          return User.findOne({where: {username: 'a2'}, include: []});
        })
        .then((u) => {
          expect(u.username).to.equal('a2');
        })
        .then(() => {
          return User.findOne({where: {username: 'a1'}, include: []});
        })
        .then((u) => {
          expect(u.username).to.equal('a1');
        });
    });
  });

  describe('findOrInitialize', () => {
    // TODO@robin sqlite3 transaction issue
    // if (current.dialect.supports.transactions) {
    //   it('supports transactions', () => {
    //     return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
    //       const User = sequelize.define('User', {username: Sequelize.STRING, foo: Sequelize.STRING});
    //
    //       return User.sync({force: true}).then(() => {
    //         return sequelize.transaction().then((t) => {
    //           return User.create({username: 'foo'}, {transaction: t}).then(() => {
    //             return User.findOrInitialize({
    //               where: {username: 'foo'}
    //             }).spread((user1) => {
    //               return User.findOrInitialize({
    //                 where: {username: 'foo'},
    //                 transaction: t
    //               }).spread((user2) => {
    //                 return User.findOrInitialize({
    //                   where: {username: 'foo'},
    //                   defaults: {foo: 'asd'},
    //                   transaction: t
    //                 }).spread((user3) => {
    //                   expect(user1.isNewRecord).to.be.true;
    //                   expect(user2.isNewRecord).to.be.false;
    //                   expect(user3.isNewRecord).to.be.false;
    //                   return t.commit();
    //                 });
    //               });
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // }

    describe('returns an instance if it already exists', () => {
      it('with a single find field', () => {

        return MainUser.create({username: 'Username'}).then((user) => {
          return MainUser.findOrBuild({
            where: {username: user.username}
          }).then(([_user, initialized]) => {
            expect(_user.id).to.equal(user.id);
            expect(_user.username).to.equal('Username');
            expect(initialized).to.be.false;
          });
        });
      });

      it('with multiple find fields', () => {

        return MainUser.create({username: 'Username', data: 'data'}).then((user) => {
          return MainUser.findOrBuild({
            where: {
              username: user.username,
              data: user.data
            }
          }).then(([_user, initialized]) => {
            expect(_user.id).to.equal(user.id);
            expect(_user.username).to.equal('Username');
            expect(_user.data).to.equal('data');
            expect(initialized).to.be.false;
          });
        });
      });

      it('builds a new instance with default value.', () => {
        const data = {
          username: 'Username'
        };
        const defaultValues = {
          data: 'ThisIsData'
        };

        return MainUser.findOrBuild({
          where: data,
          defaults: defaultValues
        }).then(([user, initialized]) => {
          expect(user.id).to.be.null;
          expect(user.username).to.equal('Username');
          expect(user.data).to.equal('ThisIsData');
          expect(initialized).to.be.true;
          expect(user.isNewRecord).to.be.true;
        });
      });
    });
  });

  describe('update', () => {
    it('throws an error if no where clause is given', () => {
      @Table
      class User extends Model<User> {

        @Column
        username: string;
      }

      sequelize.addModels([User]);

      return sequelize.sync({force: true}).then(() => {
        return (User as any).update();
      }).then(() => {
        throw new Error('Update should throw an error if no where clause is given.');
      }, (err) => {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.match(/^Missing where attribute in the options parameter/);
      });
    });

    // TODO@robin sqlite3 transaction issue
    // if (current.dialect.supports.transactions) {
    //   it('supports transactions', () => {
    //     return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
    //       const User = sequelize.define('User', {username: Sequelize.STRING});
    //
    //       return User.sync({force: true}).then(() => {
    //         return User.create({username: 'foo'}).then(() => {
    //           return sequelize.transaction().then((t) => {
    //             return User.update({username: 'bar'}, {where: {username: 'foo'}, transaction: t}).then(() => {
    //               return User.findAll().then((users1) => {
    //                 return User.findAll({transaction: t}).then((users2) => {
    //                   expect(users1[0].username).to.equal('foo');
    //                   expect(users2[0].username).to.equal('bar');
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

    it('updates the attributes that we select only without updating createdAt', () => {
      @Table({timestamps: true, paranoid: true})
      class User extends Model<User> {

        @Column
        username: string;

        @Column
        secretValue: string;
      }

      sequelize.addModels([User]);

      let test = false;
      return User.sync({force: true}).then(() => {
        return User.create({username: 'Peter', secretValue: '42'}).then((user) => {
          return user.update({secretValue: '43'}, {
            fields: ['secretValue'], logging: (sql) => {
              test = true;
              // tslint:disable:max-line-length
              expect(sql).to.match(/UPDATE\s+[`"]+Users[`"]+\s+SET\s+[`"]+secretValue[`"]=(\$1|\?),[`"]+updatedAt[`"]+=(\$2|\?)\s+WHERE [`"]+id[`"]+\s=\s(\$3|\?)/);
            }
          });
        });
      }).then(() => {
        expect(test).to.be.true;
      });
    });
    //
    // it('allows sql logging of updated statements', () => {
    //   const User = this.sequelize.define('User', {
    //     name: Sequelize.STRING,
    //     bio: Sequelize.TEXT
    //   }, {
    //     paranoid: true
    //   });
    //   const test = false;
    //   return User.sync({force: true}).then(() => {
    //     return User.create({name: 'meg', bio: 'none'}).then((u) => {
    //       expect(u).to.exist;
    //       return u.updateAttributes({name: 'brian'}, {
    //         logging: (sql) => {
    //           test = true;
    //           expect(sql).to.exist;
    //           expect(sql.toUpperCase().indexOf('UPDATE')).to.be.above(-1);
    //         }
    //       });
    //     });
    //   }).then(() => {
    //     expect(test).to.be.true;
    //   });
    // });
    //
    // it('updates only values that match filter', () => {
    //   const self = this
    //     , data = [{username: 'Peter', secretValue: '42'},
    //     {username: 'Paul', secretValue: '42'},
    //     {username: 'Bob', secretValue: '43'}];
    //
    //   return MainUser.bulkCreate(data).then(() => {
    //     return self.User.update({username: 'Bill'}, {where: {secretValue: '42'}}).then(() => {
    //       return self.User.findAll({order: ['id']}).then((users) => {
    //         expect(users.length).to.equal(3);
    //
    //         users.forEach((user) => {
    //           if (user.secretValue === '42') {
    //             expect(user.username).to.equal('Bill');
    //           } else {
    //             expect(user.username).to.equal('Bob');
    //           }
    //         });
    //
    //       });
    //     });
    //   });
    // });
    //
    // it('updates only values that match the allowed fields', () => {
    //   const self = this
    //     , data = [{username: 'Peter', secretValue: '42'}];
    //
    //   return MainUser.bulkCreate(data).then(() => {
    //     return self.User.update({username: 'Bill', secretValue: '43'}, {
    //       where: {secretValue: '42'},
    //       fields: ['username']
    //     }).then(() => {
    //       return self.User.findAll({order: ['id']}).then((users) => {
    //         expect(users.length).to.equal(1);
    //
    //         const user = users[0];
    //         expect(user.username).to.equal('Bill');
    //         expect(user.secretValue).to.equal('42');
    //       });
    //     });
    //   });
    // });
    //
    // it('updates with casting', () => {
    //   const self = this;
    //   return MainUser.create({
    //     username: 'John'
    //   }).then(() => {
    //     return self.User.update({username: self.sequelize.cast('1', dialect === 'mssql' ? 'nvarchar' : 'char')}, {where: {username: 'John'}}).then(() => {
    //       return self.User.findAll().then((users) => {
    //         expect(users[0].username).to.equal('1');
    //       });
    //     });
    //   });
    // });
    //
    // it('updates with function and column value', () => {
    //   const self = this;
    //
    //   return MainUser.create({
    //     username: 'John'
    //   }).then(() => {
    //     return self.User.update({username: self.sequelize.fn('upper', self.sequelize.col('username'))}, {where: {username: 'John'}}).then(() => {
    //       return self.User.findAll().then((users) => {
    //         expect(users[0].username).to.equal('JOHN');
    //       });
    //     });
    //   });
    // });
    //
    // it('does not update virtual attributes', () => {
    //   const User = this.sequelize.define('User', {
    //     username: Sequelize.STRING,
    //     virtual: Sequelize.VIRTUAL
    //   });
    //
    //   return User.create({
    //     username: 'jan'
    //   }).then(() => {
    //     return User.update({
    //       username: 'kurt',
    //       virtual: 'test'
    //     }, {
    //       where: {
    //         username: 'jan'
    //       }
    //     });
    //   }).then(() => {
    //     return User.findAll();
    //   }).spread((user) => {
    //     expect(user.username).to.equal('kurt');
    //   });
    // });
    //
    // it('doesn\'t update attributes that are altered by virtual setters when option is enabled', () => {
    //   const User = this.sequelize.define('UserWithVirtualSetters', {
    //     username: Sequelize.STRING,
    //     illness_name: Sequelize.STRING,
    //     illness_pain: Sequelize.INTEGER,
    //     illness: {
    //       type: Sequelize.VIRTUAL,
    //       set: (value) => {
    //         this.set('illness_name', value.name);
    //         this.set('illness_pain', value.pain);
    //       }
    //     }
    //   });
    //
    //   return User.sync({force: true}).then(() => {
    //     return User.create({
    //       username: 'Jan',
    //       illness_name: 'Headache',
    //       illness_pain: 5
    //     });
    //   }).then(() => {
    //     return User.update({
    //       illness: {pain: 10, name: 'Backache'}
    //     }, {
    //       where: {
    //         username: 'Jan'
    //       },
    //       sideEffects: false
    //     });
    //   }).then((user) => {
    //     return User.findAll();
    //   }).spread((user) => {
    //     expect(user.illness_pain).to.be.equal(5);
    //   });
    // });
    //
    // it('updates attributes that are altered by virtual setters', () => {
    //   const User = this.sequelize.define('UserWithVirtualSetters', {
    //     username: Sequelize.STRING,
    //     illness_name: Sequelize.STRING,
    //     illness_pain: Sequelize.INTEGER,
    //     illness: {
    //       type: Sequelize.VIRTUAL,
    //       set: (value) => {
    //         this.set('illness_name', value.name);
    //         this.set('illness_pain', value.pain);
    //       }
    //     }
    //   });
    //
    //   return User.sync({force: true}).then(() => {
    //     return User.create({
    //       username: 'Jan',
    //       illness_name: 'Headache',
    //       illness_pain: 5
    //     });
    //   }).then(() => {
    //     return User.update({
    //       illness: {pain: 10, name: 'Backache'}
    //     }, {
    //       where: {
    //         username: 'Jan'
    //       }
    //     });
    //   }).then((user) => {
    //     return User.findAll();
    //   }).spread((user) => {
    //     expect(user.illness_pain).to.be.equal(10);
    //   });
    // });
    //
    // it('should properly set data when individualHooks are true', () => {
    //   const self = this;
    //
    //   self.User.beforeUpdate((instance) => {
    //     instance.set('intVal', 1);
    //   });
    //
    //   return self.User.create({username: 'Peter'}).then((user) => {
    //     return self.User.update({data: 'test'}, {where: {id: user.id}, individualHooks: true}).then(() => {
    //       return self.User.findById(user.id).then(function(userUpdated) {
    //         expect(userUpdated.intVal).to.be.equal(1);
    //       });
    //     });
    //   });
    // });
    //
    // it('sets updatedAt to the current timestamp', () => {
    //   const data = [{username: 'Peter', secretValue: '42'},
    //     {username: 'Paul', secretValue: '42'},
    //     {username: 'Bob', secretValue: '43'}];
    //
    //   return MainUser.bulkCreate(data).bind(this).then(() => {
    //     return MainUser.findAll({order: ['id']});
    //   }).then((users) => {
    //     this.updatedAt = users[0].updatedAt;
    //
    //     expect(this.updatedAt).to.be.ok;
    //     expect(this.updatedAt).to.equalTime(users[2].updatedAt); // All users should have the same updatedAt
    //
    //     // Pass the time so we can actually see a change
    //     clock.tick(1000);
    //     return MainUser.update({username: 'Bill'}, {where: {secretValue: '42'}});
    //   }).then(() => {
    //     return MainUser.findAll({order: ['id']});
    //   }).then((users) => {
    //     expect(users[0].username).to.equal('Bill');
    //     expect(users[1].username).to.equal('Bill');
    //     expect(users[2].username).to.equal('Bob');
    //
    //     expect(users[0].updatedAt).to.be.afterTime(this.updatedAt);
    //     expect(users[2].updatedAt).to.equalTime(this.updatedAt);
    //   });
    // });
    //
    // it('returns the number of affected rows', () => {
    //   const self = this
    //     , data = [{username: 'Peter', secretValue: '42'},
    //     {username: 'Paul', secretValue: '42'},
    //     {username: 'Bob', secretValue: '43'}];
    //
    //   return MainUser.bulkCreate(data).then(() => {
    //     return self.User.update({username: 'Bill'}, {where: {secretValue: '42'}}).spread((affectedRows) => {
    //       expect(affectedRows).to.equal(2);
    //     }).then(() => {
    //       return self.User.update({username: 'Bill'}, {where: {secretValue: '44'}}).spread((affectedRows) => {
    //         expect(affectedRows).to.equal(0);
    //       });
    //     });
    //   });
    // });

  });
  //
  // describe('destroy', () => {
  //   it('convenient method `truncate` should clear the table', () => {
  //     const User = this.sequelize.define('User', {username: DataTypes.STRING}),
  //       data = [
  //         {username: 'user1'},
  //         {username: 'user2'}
  //       ];
  //
  //     return this.sequelize.sync({force: true}).then(() => {
  //       return User.bulkCreate(data);
  //     }).then(() => {
  //       return User.truncate();
  //     }).then(() => {
  //       return expect(User.findAll()).to.eventually.have.length(0);
  //     });
  //   });
  //
  //   it('truncate should clear the table', () => {
  //     const User = this.sequelize.define('User', {username: DataTypes.STRING}),
  //       data = [
  //         {username: 'user1'},
  //         {username: 'user2'}
  //       ];
  //
  //     return this.sequelize.sync({force: true}).then(() => {
  //       return User.bulkCreate(data);
  //     }).then(() => {
  //       return User.destroy({truncate: true});
  //     }).then(() => {
  //       return expect(User.findAll()).to.eventually.have.length(0);
  //     });
  //   });
  //
  //   it('throws an error if no where clause is given', () => {
  //     const User = this.sequelize.define('User', {username: DataTypes.STRING});
  //
  //     return this.sequelize.sync({force: true}).then(() => {
  //       return User.destroy();
  //     }).then(() => {
  //       throw new Error('Destroy should throw an error if no where clause is given.');
  //     }, (err) => {
  //       expect(err).to.be.an.instanceof(Error);
  //       expect(err.message).to.equal('Missing where or truncate attribute in the options parameter of model.destroy.');
  //     });
  //   });
  //
  //   it('deletes all instances when given an empty where object', () => {
  //     const User = this.sequelize.define('User', {username: DataTypes.STRING}),
  //       data = [
  //         {username: 'user1'},
  //         {username: 'user2'}
  //       ];
  //
  //     return this.sequelize.sync({force: true}).then(() => {
  //       return User.bulkCreate(data);
  //     }).then(() => {
  //       return User.destroy({where: {}});
  //     }).then((affectedRows) => {
  //       expect(affectedRows).to.equal(2);
  //       return User.findAll();
  //     }).then((users) => {
  //       expect(users).to.have.length(0);
  //     });
  //   });
  //
  //   if (current.dialect.supports.transactions) {
  //     it('supports transactions', () => {
  //       return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
  //         const User = sequelize.define('User', {username: Sequelize.STRING});
  //
  //         return User.sync({force: true}).then(() => {
  //           return User.create({username: 'foo'}).then(() => {
  //             return sequelize.transaction().then((t) => {
  //               return User.destroy({
  //                 where: {},
  //                 transaction: t
  //               }).then(() => {
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
  //   it('deletes values that match filter', () => {
  //     const self = this
  //       , data = [{username: 'Peter', secretValue: '42'},
  //       {username: 'Paul', secretValue: '42'},
  //       {username: 'Bob', secretValue: '43'}];
  //
  //     return MainUser.bulkCreate(data).then(() => {
  //       return self.User.destroy({where: {secretValue: '42'}})
  //         .then(() => {
  //           return self.User.findAll({order: ['id']}).then((users) => {
  //             expect(users.length).to.equal(1);
  //             expect(users[0].username).to.equal('Bob');
  //           });
  //         });
  //     });
  //   });
  //
  //   it('works without a primary key', () => {
  //     const Log = this.sequelize.define('Log', {
  //       client_id: DataTypes.INTEGER,
  //       content: DataTypes.TEXT,
  //       timestamp: DataTypes.DATE
  //     });
  //     Log.removeAttribute('id');
  //
  //     return Log.sync({force: true}).then(() => {
  //       return Log.create({
  //         client_id: 13,
  //         content: 'Error!',
  //         timestamp: new Date()
  //       });
  //     }).then(() => {
  //       return Log.destroy({
  //         where: {
  //           client_id: 13
  //         }
  //       });
  //     }).then(() => {
  //       return Log.findAll().then((logs) => {
  //         expect(logs.length).to.equal(0);
  //       });
  //     });
  //   });
  //
  //   it('supports .field', () => {
  //     const UserProject = this.sequelize.define('UserProject', {
  //       userId: {
  //         type: DataTypes.INTEGER,
  //         field: 'user_id'
  //       }
  //     });
  //
  //     return UserProject.sync({force: true}).then(() => {
  //       return UserProject.create({
  //         userId: 10
  //       });
  //     }).then(() => {
  //       return UserProject.destroy({
  //         where: {
  //           userId: 10
  //         }
  //       });
  //     }).then(() => {
  //       return UserProject.findAll();
  //     }).then((userProjects) => {
  //       expect(userProjects.length).to.equal(0);
  //     });
  //   });
  //
  //   it('sets deletedAt to the current timestamp if paranoid is true', () => {
  //     const self = this
  //       , qi = this.sequelize.queryInterface.QueryGenerator.quoteIdentifier.bind(this.sequelize.queryInterface.QueryGenerator)
  //       , ParanoidUser = self.sequelize.define('ParanoidUser', {
  //       username: Sequelize.STRING,
  //       secretValue: Sequelize.STRING,
  //       data: Sequelize.STRING,
  //       intVal: {type: Sequelize.INTEGER, defaultValue: 1}
  //     }, {
  //       paranoid: true
  //     })
  //       , data = [{username: 'Peter', secretValue: '42'},
  //       {username: 'Paul', secretValue: '42'},
  //       {username: 'Bob', secretValue: '43'}];
  //
  //     return ParanoidUser.sync({force: true}).then(() => {
  //       return ParanoidUser.bulkCreate(data);
  //     }).bind({}).then(() => {
  //       // since we save in UTC, let's format to UTC time
  //       this.date = moment().utc().format('YYYY-MM-DD h:mm');
  //       return ParanoidUser.destroy({where: {secretValue: '42'}});
  //     }).then(() => {
  //       return ParanoidUser.findAll({order: ['id']});
  //     }).then((users) => {
  //       expect(users.length).to.equal(1);
  //       expect(users[0].username).to.equal('Bob');
  //
  //       return self.sequelize.query('SELECT * FROM ' + qi('ParanoidUsers') + ' WHERE ' + qi('deletedAt') + ' IS NOT NULL ORDER BY ' + qi('id'));
  //     }).spread((users) => {
  //       expect(users[0].username).to.equal('Peter');
  //       expect(users[1].username).to.equal('Paul');
  //
  //       expect(moment(new Date(users[0].deletedAt)).utc().format('YYYY-MM-DD h:mm')).to.equal(this.date);
  //       expect(moment(new Date(users[1].deletedAt)).utc().format('YYYY-MM-DD h:mm')).to.equal(this.date);
  //     });
  //   });
  //
  //   it('does not set deletedAt for previously destroyed instances if paranoid is true', () => {
  //     const User = this.sequelize.define('UserCol', {
  //       secretValue: Sequelize.STRING,
  //       username: Sequelize.STRING
  //     }, {paranoid: true});
  //
  //     return User.sync({force: true}).then(() => {
  //       return User.bulkCreate([
  //         {username: 'Toni', secretValue: '42'},
  //         {username: 'Tobi', secretValue: '42'},
  //         {username: 'Max', secretValue: '42'}
  //       ]).then(() => {
  //         return User.findById(1).then((user) => {
  //           return user.destroy().then(() => {
  //             return user.reload({paranoid: false}).then(() => {
  //               const deletedAt = user.deletedAt;
  //
  //               return User.destroy({where: {secretValue: '42'}}).then(() => {
  //                 return user.reload({paranoid: false}).then(() => {
  //                   expect(user.deletedAt).to.eql(deletedAt);
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  //
  //   describe("can't find records marked as deleted with paranoid being true", () => {
  //     it('with the DAOFactory', () => {
  //       const User = this.sequelize.define('UserCol', {
  //         username: Sequelize.STRING
  //       }, {paranoid: true});
  //
  //       return User.sync({force: true}).then(() => {
  //         return User.bulkCreate([
  //           {username: 'Toni'},
  //           {username: 'Tobi'},
  //           {username: 'Max'}
  //         ]).then(() => {
  //           return User.findById(1).then((user) => {
  //             return user.destroy().then(() => {
  //               return User.findById(1).then((user) => {
  //                 expect(user).to.be.null;
  //                 return User.count().then((cnt) => {
  //                   expect(cnt).to.equal(2);
  //                   return User.findAll().then((users) => {
  //                     expect(users).to.have.length(2);
  //                   });
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  //
  //   describe('can find paranoid records if paranoid is marked as false in query', () => {
  //     it('with the DAOFactory', () => {
  //       const User = this.sequelize.define('UserCol', {
  //         username: Sequelize.STRING
  //       }, {paranoid: true});
  //
  //       return User.sync({force: true})
  //         .then(() => {
  //           return User.bulkCreate([
  //             {username: 'Toni'},
  //             {username: 'Tobi'},
  //             {username: 'Max'}
  //           ]);
  //         })
  //         .then(() => {
  //           return User.findById(1);
  //         })
  //         .then((user) => {
  //           return user.destroy();
  //         })
  //         .then(() => {
  //           return User.find({where: 1, paranoid: false});
  //         })
  //         .then((user) => {
  //           expect(user).to.exist;
  //           return User.findById(1);
  //         })
  //         .then((user) => {
  //           expect(user).to.be.null;
  //           return [User.count(), User.count({paranoid: false})];
  //         })
  //         .spread((cnt, cntWithDeleted) => {
  //           expect(cnt).to.equal(2);
  //           expect(cntWithDeleted).to.equal(3);
  //         });
  //     });
  //   });
  //
  //   it('should include deleted associated records if include has paranoid marked as false', () => {
  //     const User = this.sequelize.define('User', {
  //       username: Sequelize.STRING
  //     }, {paranoid: true});
  //     const Pet = this.sequelize.define('Pet', {
  //       name: Sequelize.STRING,
  //       UserId: Sequelize.INTEGER
  //     }, {paranoid: true});
  //
  //     User.hasMany(Pet);
  //     Pet.belongsTo(User);
  //
  //     const user;
  //     return User.sync({force: true})
  //       .then(() => {
  //         return Pet.sync({force: true});
  //       })
  //       .then(() => {
  //         return User.create({username: 'Joe'});
  //       })
  //       .then((_user) => {
  //         user = _user;
  //         return Pet.bulkCreate([
  //           {name: 'Fido', UserId: user.id},
  //           {name: 'Fifi', UserId: user.id}
  //         ]);
  //       })
  //       .then(() => {
  //         return Pet.findById(1);
  //       })
  //       .then((pet) => {
  //         return pet.destroy();
  //       })
  //       .then(() => {
  //         return [
  //           User.find({where: {id: user.id}, include: Pet}),
  //           User.find({
  //             where: {id: user.id},
  //             include: [{model: Pet, paranoid: false}]
  //           })
  //         ];
  //       })
  //       .spread((user, userWithDeletedPets) => {
  //         expect(user).to.exist;
  //         expect(user.Pets).to.have.length(1);
  //         expect(userWithDeletedPets).to.exist;
  //         expect(userWithDeletedPets.Pets).to.have.length(2);
  //       });
  //   });
  //
  //   it('should delete a paranoid record if I set force to true', () => {
  //     const self = this;
  //     const User = this.sequelize.define('paranoiduser', {
  //       username: Sequelize.STRING
  //     }, {paranoid: true});
  //
  //     return User.sync({force: true}).then(() => {
  //       return User.bulkCreate([
  //         {username: 'Bob'},
  //         {username: 'Tobi'},
  //         {username: 'Max'},
  //         {username: 'Tony'}
  //       ]);
  //     }).then(() => {
  //       return User.find({where: {username: 'Bob'}});
  //     }).then((user) => {
  //       return user.destroy({force: true});
  //     }).then(() => {
  //       return expect(User.find({where: {username: 'Bob'}})).to.eventually.be.null;
  //     }).then(() => {
  //       return User.find({where: {username: 'Tobi'}});
  //     }).then((tobi) => {
  //       return tobi.destroy();
  //     }).then(() => {
  //       return self.sequelize.query('SELECT * FROM paranoidusers WHERE username=\'Tobi\'', {plain: true});
  //     }).then((result) => {
  //       expect(result.username).to.equal('Tobi');
  //       return User.destroy({where: {username: 'Tony'}});
  //     }).then(() => {
  //       return self.sequelize.query('SELECT * FROM paranoidusers WHERE username=\'Tony\'', {plain: true});
  //     }).then((result) => {
  //       expect(result.username).to.equal('Tony');
  //       return User.destroy({where: {username: ['Tony', 'Max']}, force: true});
  //     }).then(() => {
  //       return self.sequelize.query('SELECT * FROM paranoidusers', {raw: true});
  //     }).spread((users) => {
  //       expect(users).to.have.length(1);
  //       expect(users[0].username).to.equal('Tobi');
  //     });
  //   });
  //
  //   it('returns the number of affected rows', () => {
  //     const self = this
  //       , data = [{username: 'Peter', secretValue: '42'},
  //       {username: 'Paul', secretValue: '42'},
  //       {username: 'Bob', secretValue: '43'}];
  //
  //     return MainUser.bulkCreate(data).then(() => {
  //       return self.User.destroy({where: {secretValue: '42'}}).then((affectedRows) => {
  //         expect(affectedRows).to.equal(2);
  //       });
  //     }).then(() => {
  //       return self.User.destroy({where: {secretValue: '44'}}).then((affectedRows) => {
  //         expect(affectedRows).to.equal(0);
  //       });
  //     });
  //   });
  //
  //   it('supports table schema/prefix', () => {
  //     const self = this
  //       , data = [{username: 'Peter', secretValue: '42'},
  //       {username: 'Paul', secretValue: '42'},
  //       {username: 'Bob', secretValue: '43'}]
  //       , prefixUser = self.User.schema('prefix');
  //
  //     const run = () => {
  //       return prefixUser.sync({force: true}).then(() => {
  //         return prefixUser.bulkCreate(data).then(() => {
  //           return prefixUser.destroy({where: {secretValue: '42'}}).then(() => {
  //             return prefixUser.findAll({order: ['id']}).then((users) => {
  //               expect(users.length).to.equal(1);
  //               expect(users[0].username).to.equal('Bob');
  //             });
  //           });
  //         });
  //       });
  //     };
  //
  //     return this.sequelize.queryInterface.dropAllSchemas().then(() => {
  //       return self.sequelize.queryInterface.createSchema('prefix').then(() => {
  //         return run.call(self);
  //       });
  //     });
  //   });
  // });
  //
  // describe('restore', () => {
  //   it('returns an error if the model is not paranoid', () => {
  //     const self = this;
  //
  //     return MainUser.create({username: 'Peter', secretValue: '42'})
  //       .then(() => {
  //         expect(() => {
  //           self.User.restore({where: {secretValue: '42'}});
  //         }).to.throw(Error, 'Model is not paranoid');
  //       });
  //   });
  //
  //   it('restores a previously deleted model', () => {
  //     const self = this
  //       , ParanoidUser = self.sequelize.define('ParanoidUser', {
  //       username: Sequelize.STRING,
  //       secretValue: Sequelize.STRING,
  //       data: Sequelize.STRING,
  //       intVal: {type: Sequelize.INTEGER, defaultValue: 1}
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
  //       return ParanoidUser.destroy({where: {secretValue: '42'}});
  //     }).then(() => {
  //       return ParanoidUser.restore({where: {secretValue: '42'}});
  //     }).then(() => {
  //       return ParanoidUser.find({where: {secretValue: '42'}});
  //     }).then((user) => {
  //       expect(user).to.be.ok;
  //       expect(user.username).to.equal('Peter');
  //     });
  //   });
  // });
  //
  // describe('equals', () => {
  //   it('correctly determines equality of objects', () => {
  //     return MainUser.create({username: 'hallo', data: 'welt'}).then((u) => {
  //       expect(u.equals(u)).to.be.ok;
  //     });
  //   });
  //
  //   // sqlite can't handle multiple primary keys
  //   if (dialect !== 'sqlite') {
  //     it('correctly determines equality with multiple primary keys', () => {
  //       const userKeys = this.sequelize.define('userkeys', {
  //         foo: {type: Sequelize.STRING, primaryKey: true},
  //         bar: {type: Sequelize.STRING, primaryKey: true},
  //         name: Sequelize.STRING,
  //         bio: Sequelize.TEXT
  //       });
  //
  //       return userKeys.sync({force: true}).then(() => {
  //         return userKeys.create({foo: '1', bar: '2', name: 'hallo', bio: 'welt'}).then((u) => {
  //           expect(u.equals(u)).to.be.ok;
  //         });
  //       });
  //     });
  //   }
  // });
  //
  // describe('equalsOneOf', () => {
  //   // sqlite can't handle multiple primary keys
  //   if (dialect !== 'sqlite') {
  //     beforeEach(() => {
  //       MainUserKey = this.sequelize.define('userKeys', {
  //         foo: {type: Sequelize.STRING, primaryKey: true},
  //         bar: {type: Sequelize.STRING, primaryKey: true},
  //         name: Sequelize.STRING,
  //         bio: Sequelize.TEXT
  //       });
  //
  //       return MainUserKey.sync({force: true});
  //     });
  //
  //     it('determines equality if one is matching', () => {
  //       return MainUserKey.create({foo: '1', bar: '2', name: 'hallo', bio: 'welt'}).then((u) => {
  //         expect(u.equalsOneOf([u, {a: 1}])).to.be.ok;
  //       });
  //     });
  //
  //     it("doesn't determine equality if none is matching", () => {
  //       return MainUserKey.create({foo: '1', bar: '2', name: 'hallo', bio: 'welt'}).then((u) => {
  //         expect(u.equalsOneOf([{b: 2}, {a: 1}])).to.not.be.ok;
  //       });
  //     });
  //   }
  // });
  //
  // describe('count', () => {
  //   if (current.dialect.supports.transactions) {
  //     it('supports transactions', () => {
  //       return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
  //         const User = sequelize.define('User', {username: Sequelize.STRING});
  //
  //         return User.sync({force: true}).then(() => {
  //           return sequelize.transaction().then((t) => {
  //             return User.create({username: 'foo'}, {transaction: t}).then(() => {
  //               return User.count().then((count1) => {
  //                 return User.count({transaction: t}).then((count2) => {
  //                   expect(count1).to.equal(0);
  //                   expect(count2).to.equal(1);
  //                   return t.rollback();
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   }
  //
  //   it('counts all created objects', () => {
  //     const self = this;
  //     return MainUser.bulkCreate([{username: 'user1'}, {username: 'user2'}]).then(() => {
  //       return self.User.count().then((count) => {
  //         expect(count).to.equal(2);
  //       });
  //     });
  //   });
  //
  //   it('returns multiple rows when using group', () => {
  //     const self = this;
  //     return MainUser.bulkCreate([
  //       {username: 'user1', data: 'A'},
  //       {username: 'user2', data: 'A'},
  //       {username: 'user3', data: 'B'}
  //     ]).then(() => {
  //       return self.User.count({
  //         attributes: ['data'],
  //         group: ['data']
  //       }).then((count) => {
  //         expect(count.length).to.equal(2);
  //       });
  //     });
  //   });
  //
  //   describe("options sent to aggregate", () => {
  //     const options, aggregateSpy;
  //
  //     beforeEach(() => {
  //       options = {where: {username: 'user1'}};
  //
  //       aggregateSpy = spy(MainUser, "aggregate");
  //     });
  //
  //     afterEach(() => {
  //       expect(aggregateSpy).to.have.been.calledWith(
  //         sinon.match.any, sinon.match.any,
  //         sinon.match.object.and(sinon.match.has('where', {username: 'user1'})));
  //
  //       aggregateSpy.restore();
  //     });
  //
  //     it('modifies option "limit" by setting it to null', () => {
  //       options.limit = 5;
  //
  //       return MainUser.count(options).then(() => {
  //         expect(aggregateSpy).to.have.been.calledWith(
  //           sinon.match.any, sinon.match.any,
  //           sinon.match.object.and(sinon.match.has('limit', null)));
  //       });
  //     });
  //
  //     it('modifies option "offset" by setting it to null', () => {
  //       options.offset = 10;
  //
  //       return MainUser.count(options).then(() => {
  //         expect(aggregateSpy).to.have.been.calledWith(
  //           sinon.match.any, sinon.match.any,
  //           sinon.match.object.and(sinon.match.has('offset', null)));
  //       });
  //     });
  //
  //     it('modifies option "order" by setting it to null', () => {
  //       options.order = "username";
  //
  //       return MainUser.count(options).then(() => {
  //         expect(aggregateSpy).to.have.been.calledWith(
  //           sinon.match.any, sinon.match.any,
  //           sinon.match.object.and(sinon.match.has('order', null)));
  //       });
  //     });
  //   });
  //
  //   it('allows sql logging', () => {
  //     const test = false;
  //     return MainUser.count({
  //       logging: (sql) => {
  //         test = true;
  //         expect(sql).to.exist;
  //         expect(sql.toUpperCase().indexOf('SELECT')).to.be.above(-1);
  //       }
  //     }).then(() => {
  //       expect(test).to.be.true;
  //     });
  //   });
  //
  //   it('filters object', () => {
  //     const self = this;
  //     return MainUser.create({username: 'user1'}).then(() => {
  //       return self.User.create({username: 'foo'}).then(() => {
  //         return self.User.count({where: ["username LIKE '%us%'"]}).then((count) => {
  //           expect(count).to.equal(1);
  //         });
  //       });
  //     });
  //   });
  //
  //   it('supports distinct option', () => {
  //     const Post = this.sequelize.define('Post', {});
  //     const PostComment = this.sequelize.define('PostComment', {});
  //     Post.hasMany(PostComment);
  //     return Post.sync({force: true})
  //       .then(() => PostComment.sync({force: true}))
  //       .then(() => Post.create({}))
  //       .then((post) => PostComment.bulkCreate([{PostId: post.id}, {PostId: post.id}]))
  //       .then(() => Promise.join(
  //         Post.count({distinct: false, include: [{model: PostComment, required: false}]}),
  //         Post.count({distinct: true, include: [{model: PostComment, required: false}]}),
  //         (count1, count2) => {
  //           expect(count1).to.equal(2);
  //           expect(count2).to.equal(1);
  //         })
  //       );
  //   });
  //
  // });
  //
  // describe('min', () => {
  //   beforeEach(() => {
  //     const self = this;
  //     MainUserWithAge = this.sequelize.define('UserWithAge', {
  //       age: Sequelize.INTEGER
  //     });
  //
  //     MainUserWithDec = this.sequelize.define('UserWithDec', {
  //       value: Sequelize.DECIMAL(10, 3)
  //     });
  //
  //     return MainUserWithAge.sync({force: true}).then(() => {
  //       return self.UserWithDec.sync({force: true});
  //     });
  //   });
  //
  //   if (current.dialect.supports.transactions) {
  //     it('supports transactions', () => {
  //       return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
  //         const User = sequelize.define('User', {age: Sequelize.INTEGER});
  //
  //         return User.sync({force: true}).then(() => {
  //           return sequelize.transaction().then((t) => {
  //             return User.bulkCreate([{age: 2}, {age: 5}, {age: 3}], {transaction: t}).then(() => {
  //               return User.min('age').then((min1) => {
  //                 return User.min('age', {transaction: t}).then((min2) => {
  //                   expect(min1).to.be.not.ok;
  //                   expect(min2).to.equal(2);
  //                   return t.rollback();
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   }
  //
  //   it('should return the min value', () => {
  //     const self = this;
  //     return MainUserWithAge.bulkCreate([{age: 3}, {age: 2}]).then(() => {
  //       return self.UserWithAge.min('age').then((min) => {
  //         expect(min).to.equal(2);
  //       });
  //     });
  //   });
  //
  //   it('allows sql logging', () => {
  //     const test = false;
  //     return MainUserWithAge.min('age', {
  //       logging: (sql) => {
  //         test = true;
  //         expect(sql).to.exist;
  //         expect(sql.toUpperCase().indexOf('SELECT')).to.be.above(-1);
  //       }
  //     }).then(() => {
  //       expect(test).to.be.true;
  //     });
  //   });
  //
  //   it('should allow decimals in min', () => {
  //     const self = this;
  //     return MainUserWithDec.bulkCreate([{value: 5.5}, {value: 3.5}]).then(() => {
  //       return self.UserWithDec.min('value').then((min) => {
  //         expect(min).to.equal(3.5);
  //       });
  //     });
  //   });
  //
  //   it('should allow strings in min', () => {
  //     const self = this;
  //     return MainUser.bulkCreate([{username: 'bbb'}, {username: 'yyy'}]).then(() => {
  //       return self.User.min('username').then((min) => {
  //         expect(min).to.equal('bbb');
  //       });
  //     });
  //   });
  //
  //   it('should allow dates in min', () => {
  //     const self = this;
  //     return MainUser.bulkCreate([{theDate: new Date(2000, 1, 1)}, {theDate: new Date(1990, 1, 1)}]).then(() => {
  //       return self.User.min('theDate').then((min) => {
  //         expect(min).to.be.a('Date');
  //         expect(new Date(1990, 1, 1)).to.equalDate(min);
  //       });
  //     });
  //   });
  // });
  //
  // describe('max', () => {
  //   beforeEach(() => {
  //     const self = this;
  //     MainUserWithAge = this.sequelize.define('UserWithAge', {
  //       age: Sequelize.INTEGER,
  //       order: Sequelize.INTEGER
  //     });
  //
  //     MainUserWithDec = this.sequelize.define('UserWithDec', {
  //       value: Sequelize.DECIMAL(10, 3)
  //     });
  //
  //     return MainUserWithAge.sync({force: true}).then(() => {
  //       return self.UserWithDec.sync({force: true});
  //     });
  //   });
  //
  //   if (current.dialect.supports.transactions) {
  //     it('supports transactions', () => {
  //       return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
  //         const User = sequelize.define('User', {age: Sequelize.INTEGER});
  //
  //         return User.sync({force: true}).then(() => {
  //           return sequelize.transaction().then((t) => {
  //             return User.bulkCreate([{age: 2}, {age: 5}, {age: 3}], {transaction: t}).then(() => {
  //               return User.max('age').then((min1) => {
  //                 return User.max('age', {transaction: t}).then((min2) => {
  //                   expect(min1).to.be.not.ok;
  //                   expect(min2).to.equal(5);
  //                   return t.rollback();
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   }
  //
  //   it('should return the max value for a field named the same as an SQL reserved keyword', () => {
  //     const self = this;
  //     return MainUserWithAge.bulkCreate([{age: 2, order: 3}, {age: 3, order: 5}]).then(() => {
  //       return self.UserWithAge.max('order').then((max) => {
  //         expect(max).to.equal(5);
  //       });
  //     });
  //   });
  //
  //   it('should return the max value', () => {
  //     const self = this;
  //     return self.UserWithAge.bulkCreate([{age: 2}, {age: 3}]).then(() => {
  //       return self.UserWithAge.max('age').then((max) => {
  //         expect(max).to.equal(3);
  //       });
  //     });
  //   });
  //
  //   it('should allow decimals in max', () => {
  //     const self = this;
  //     return MainUserWithDec.bulkCreate([{value: 3.5}, {value: 5.5}]).then(() => {
  //       return self.UserWithDec.max('value').then((max) => {
  //         expect(max).to.equal(5.5);
  //       });
  //     });
  //   });
  //
  //   it('should allow dates in max', () => {
  //     const self = this;
  //     return MainUser.bulkCreate([
  //       {theDate: new Date(2013, 11, 31)},
  //       {theDate: new Date(2000, 1, 1)}
  //     ]).then(() => {
  //       return self.User.max('theDate').then((max) => {
  //         expect(max).to.be.a('Date');
  //         expect(max).to.equalDate(new Date(2013, 11, 31));
  //       });
  //     });
  //   });
  //
  //   it('should allow strings in max', () => {
  //     const self = this;
  //     return MainUser.bulkCreate([{username: 'aaa'}, {username: 'zzz'}]).then(() => {
  //       return self.User.max('username').then((max) => {
  //         expect(max).to.equal('zzz');
  //       });
  //     });
  //   });
  //
  //   it('allows sql logging', () => {
  //     const logged = false;
  //     return MainUserWithAge.max('age', {
  //       logging: (sql) => {
  //         expect(sql).to.exist;
  //         logged = true;
  //         expect(sql.toUpperCase().indexOf('SELECT')).to.be.above(-1);
  //       }
  //     }).then(() => {
  //       expect(logged).to.true;
  //     });
  //   });
  // });
  //
  // describe('sum', () => {
  //   beforeEach(() => {
  //     MainUserWithAge = this.sequelize.define('UserWithAge', {
  //       age: Sequelize.INTEGER,
  //       order: Sequelize.INTEGER,
  //       gender: Sequelize.ENUM('male', 'female')
  //     });
  //
  //     MainUserWithDec = this.sequelize.define('UserWithDec', {
  //       value: Sequelize.DECIMAL(10, 3)
  //     });
  //
  //     MainUserWithFields = this.sequelize.define('UserWithFields', {
  //       age: {
  //         type: Sequelize.INTEGER,
  //         field: 'user_age'
  //       },
  //       order: Sequelize.INTEGER,
  //       gender: {
  //         type: Sequelize.ENUM('male', 'female'),
  //         field: 'male_female'
  //       }
  //     });
  //
  //     return Promise.join(
  //       MainUserWithAge.sync({force: true}),
  //       MainUserWithDec.sync({force: true}),
  //       MainUserWithFields.sync({force: true})
  //     );
  //   });
  //
  //   it('should return the sum of the values for a field named the same as an SQL reserved keyword', () => {
  //     const self = this;
  //     return MainUserWithAge.bulkCreate([{age: 2, order: 3}, {age: 3, order: 5}]).then(() => {
  //       return self.UserWithAge.sum('order').then((sum) => {
  //         expect(sum).to.equal(8);
  //       });
  //     });
  //   });
  //
  //   it('should return the sum of a field in various records', () => {
  //     const self = this;
  //     return self.UserWithAge.bulkCreate([{age: 2}, {age: 3}]).then(() => {
  //       return self.UserWithAge.sum('age').then((sum) => {
  //         expect(sum).to.equal(5);
  //       });
  //     });
  //   });
  //
  //   it('should allow decimals in sum', () => {
  //     const self = this;
  //     return MainUserWithDec.bulkCreate([{value: 3.5}, {value: 5.25}]).then(() => {
  //       return self.UserWithDec.sum('value').then((sum) => {
  //         expect(sum).to.equal(8.75);
  //       });
  //     });
  //   });
  //
  //   it('should accept a where clause', () => {
  //     const options = {where: {'gender': 'male'}};
  //
  //     const self = this;
  //     return self.UserWithAge.bulkCreate([{age: 2, gender: 'male'}, {age: 3, gender: 'female'}]).then(() => {
  //       return self.UserWithAge.sum('age', options).then((sum) => {
  //         expect(sum).to.equal(2);
  //       });
  //     });
  //   });
  //
  //   it('should accept a where clause with custom fields', () => {
  //     return MainUserWithFields.bulkCreate([
  //       {age: 2, gender: 'male'},
  //       {age: 3, gender: 'female'}
  //     ]).bind(this).then(() => {
  //       return expect(MainUserWithFields.sum('age', {
  //         where: {'gender': 'male'}
  //       })).to.eventually.equal(2);
  //     });
  //   });
  //
  //   it('allows sql logging', () => {
  //     const logged = false;
  //     return MainUserWithAge.sum('age', {
  //       logging: (sql) => {
  //         expect(sql).to.exist;
  //         logged = true;
  //         expect(sql.toUpperCase().indexOf('SELECT')).to.be.above(-1);
  //       }
  //     }).then(() => {
  //       expect(logged).to.true;
  //     });
  //   });
  // });
  //
  // describe('schematic support', () => {
  //   beforeEach(() => {
  //     const self = this;
  //
  //     MainUserPublic = this.sequelize.define('UserPublic', {
  //       age: Sequelize.INTEGER
  //     });
  //
  //     MainUserSpecial = this.sequelize.define('UserSpecial', {
  //       age: Sequelize.INTEGER
  //     });
  //
  //     return self.sequelize.dropAllSchemas().then(() => {
  //       return self.sequelize.createSchema('schema_test').then(() => {
  //         return self.sequelize.createSchema('special').then(() => {
  //           return self.UserSpecial.schema('special').sync({force: true}).then((UserSpecialSync) => {
  //             self.UserSpecialSync = UserSpecialSync;
  //           });
  //         });
  //       });
  //     });
  //   });
  //
  //   it('should be able to drop with schemas', () => {
  //     return MainUserSpecial.drop();
  //   });
  //
  //   it('should be able to list schemas', () => {
  //     return this.sequelize.showAllSchemas().then((schemas) => {
  //       expect(schemas).to.be.instanceof(Array);
  //
  //       // FIXME: reenable when schema support is properly added
  //       if (dialect !== 'mssql') {
  //         // sqlite & MySQL doesn't actually create schemas unless Model.sync() is called
  //         // Postgres supports schemas natively
  //         expect(schemas).to.have.length((dialect === 'postgres' ? 2 : 1));
  //       }
  //
  //     });
  //   });
  //
  //   if (dialect === 'mysql' || dialect === 'sqlite') {
  //     it('should take schemaDelimiter into account if applicable', () => {
  //       const test = 0;
  //       const UserSpecialUnderscore = this.sequelize.define('UserSpecialUnderscore', {age: Sequelize.INTEGER}, {
  //         schema: 'hello',
  //         schemaDelimiter: '_'
  //       });
  //       const UserSpecialDblUnderscore = this.sequelize.define('UserSpecialDblUnderscore', {age: Sequelize.INTEGER});
  //       return UserSpecialUnderscore.sync({force: true}).then((User) => {
  //         return UserSpecialDblUnderscore.schema('hello', '__').sync({force: true}).then((DblUser) => {
  //           return DblUser.create({age: 3}, {
  //             logging: (sql) => {
  //               expect(sql).to.exist;
  //               test++;
  //               expect(sql.indexOf('INSERT INTO `hello__UserSpecialDblUnderscores`')).to.be.above(-1);
  //             }
  //           }).then(() => {
  //             return User.create({age: 3}, {
  //               logging: (sql) => {
  //                 expect(sql).to.exist;
  //                 test++;
  //                 expect(sql.indexOf('INSERT INTO `hello_UserSpecialUnderscores`')).to.be.above(-1);
  //               }
  //             });
  //           });
  //         }).then(() => {
  //           expect(test).to.equal(2);
  //         });
  //       });
  //     });
  //   }
  //
  //   it('should describeTable using the default schema settings', () => {
  //     const self = this
  //       , UserPublic = this.sequelize.define('Public', {
  //       username: Sequelize.STRING
  //     })
  //       , count = 0;
  //
  //     return UserPublic.sync({force: true}).then(() => {
  //       return UserPublic.schema('special').sync({force: true}).then(() => {
  //         return self.sequelize.queryInterface.describeTable('Publics', {
  //           logging: (sql) => {
  //             if (dialect === 'sqlite' || dialect === 'mysql' || dialect === 'mssql') {
  //               expect(sql).to.not.contain('special');
  //               count++;
  //             }
  //           }
  //         }).then((table) => {
  //           if (dialect === 'postgres') {
  //             expect(table.id.defaultValue).to.not.contain('special');
  //             count++;
  //           }
  //           return self.sequelize.queryInterface.describeTable('Publics', {
  //             schema: 'special',
  //             logging: (sql) => {
  //               if (dialect === 'sqlite' || dialect === 'mysql' || dialect === 'mssql') {
  //                 expect(sql).to.contain('special');
  //                 count++;
  //               }
  //             }
  //           }).then((table) => {
  //             if (dialect === 'postgres') {
  //               expect(table.id.defaultValue).to.contain('special');
  //               count++;
  //             }
  //           });
  //         }).then(() => {
  //           expect(count).to.equal(2);
  //         });
  //       });
  //     });
  //   });
  //
  //   it('should be able to reference a table with a schema set', () => {
  //     const self = this;
  //
  //     const UserPub = this.sequelize.define('UserPub', {
  //       username: Sequelize.STRING
  //     }, {schema: 'prefix'});
  //
  //     const ItemPub = this.sequelize.define('ItemPub', {
  //       name: Sequelize.STRING
  //     }, {schema: 'prefix'});
  //
  //     UserPub.hasMany(ItemPub, {
  //       foreignKeyConstraint: true
  //     });
  //
  //     const run = () => {
  //       return UserPub.sync({force: true}).then(() => {
  //         return ItemPub.sync({
  //           force: true, logging: _.after(2, _.once((sql) => {
  //             if (dialect === 'postgres') {
  //               expect(sql).to.match(/REFERENCES\s+"prefix"\."UserPubs" \("id"\)/);
  //             } else if (dialect === 'mssql') {
  //               expect(sql).to.match(/REFERENCES\s+\[prefix\]\.\[UserPubs\] \(\[id\]\)/);
  //             } else {
  //               expect(sql).to.match(/REFERENCES\s+`prefix\.UserPubs` \(`id`\)/);
  //             }
  //
  //           }))
  //         });
  //       });
  //     };
  //
  //     if (dialect === 'postgres') {
  //       return this.sequelize.queryInterface.dropAllSchemas().then(() => {
  //         return self.sequelize.queryInterface.createSchema('prefix').then(() => {
  //           return run.call(self);
  //         });
  //       });
  //     } else {
  //       return run.call(self);
  //     }
  //   });
  //
  //   it('should be able to create and update records under any valid schematic', () => {
  //     const self = this;
  //     const logged = 0;
  //     return self.UserPublic.sync({force: true}).then((UserPublicSync) => {
  //       return UserPublicSync.create({age: 3}, {
  //         logging: (UserPublic) => {
  //           logged++;
  //           if (dialect === 'postgres') {
  //             expect(self.UserSpecialSync.getTableName().toString()).to.equal('"special"."UserSpecials"');
  //             expect(UserPublic.indexOf('INSERT INTO "UserPublics"')).to.be.above(-1);
  //           } else if (dialect === 'sqlite') {
  //             expect(self.UserSpecialSync.getTableName().toString()).to.equal('`special.UserSpecials`');
  //             expect(UserPublic.indexOf('INSERT INTO `UserPublics`')).to.be.above(-1);
  //           } else if (dialect === 'mssql') {
  //             expect(self.UserSpecialSync.getTableName().toString()).to.equal('[special].[UserSpecials]');
  //             expect(UserPublic.indexOf('INSERT INTO [UserPublics]')).to.be.above(-1);
  //           } else {
  //             expect(self.UserSpecialSync.getTableName().toString()).to.equal('`special.UserSpecials`');
  //             expect(UserPublic.indexOf('INSERT INTO `UserPublics`')).to.be.above(-1);
  //           }
  //         }
  //       }).then((UserPublic) => {
  //         return self.UserSpecialSync.schema('special').create({age: 3}, {
  //           logging: (UserSpecial) => {
  //             logged++;
  //             if (dialect === 'postgres') {
  //               expect(UserSpecial.indexOf('INSERT INTO "special"."UserSpecials"')).to.be.above(-1);
  //             } else if (dialect === 'sqlite') {
  //               expect(UserSpecial.indexOf('INSERT INTO `special.UserSpecials`')).to.be.above(-1);
  //             } else if (dialect === 'mssql') {
  //               expect(UserSpecial.indexOf('INSERT INTO [special].[UserSpecials]')).to.be.above(-1);
  //             } else {
  //               expect(UserSpecial.indexOf('INSERT INTO `special.UserSpecials`')).to.be.above(-1);
  //             }
  //           }
  //         }).then((UserSpecial) => {
  //           return UserSpecial.updateAttributes({age: 5}, {
  //             logging: (user) => {
  //               logged++;
  //               if (dialect === 'postgres') {
  //                 expect(user.indexOf('UPDATE "special"."UserSpecials"')).to.be.above(-1);
  //               } else if (dialect === 'mssql') {
  //                 expect(user.indexOf('UPDATE [special].[UserSpecials]')).to.be.above(-1);
  //               } else {
  //                 expect(user.indexOf('UPDATE `special.UserSpecials`')).to.be.above(-1);
  //               }
  //             }
  //           });
  //         });
  //       }).then(() => {
  //         expect(logged).to.equal(3);
  //       });
  //     });
  //   });
  // });
  //
  // describe('references', () => {
  //   beforeEach(() => {
  //     const self = this;
  //
  //     this.Author = this.sequelize.define('author', {firstName: Sequelize.STRING});
  //
  //     return this.sequelize.getQueryInterface().dropTable('posts', {force: true}).then(() => {
  //       return self.sequelize.getQueryInterface().dropTable('authors', {force: true});
  //     }).then(() => {
  //       return self.Author.sync();
  //     });
  //   });
  //
  //   it('uses an existing dao factory and references the author table', () => {
  //     const authorIdColumn = {type: Sequelize.INTEGER, references: {model: this.Author, key: 'id'}};
  //
  //     const Post = this.sequelize.define('post', {
  //       title: Sequelize.STRING,
  //       authorId: authorIdColumn
  //     });
  //
  //     this.Author.hasMany(Post);
  //     Post.belongsTo(this.Author);
  //
  //     // The posts table gets dropped in the before filter.
  //     return Post.sync({
  //       logging: _.once((sql) => {
  //         if (dialect === 'postgres') {
  //           expect(sql).to.match(/"authorId" INTEGER REFERENCES "authors" \("id"\)/);
  //         } else if (dialect === 'mysql') {
  //           expect(sql).to.match(/FOREIGN KEY \(`authorId`\) REFERENCES `authors` \(`id`\)/);
  //         } else if (dialect === 'mssql') {
  //           expect(sql).to.match(/FOREIGN KEY \(\[authorId\]\) REFERENCES \[authors\] \(\[id\]\)/);
  //         } else if (dialect === 'sqlite') {
  //           expect(sql).to.match(/`authorId` INTEGER REFERENCES `authors` \(`id`\)/);
  //         } else {
  //           throw new Error('Undefined dialect!');
  //         }
  //       })
  //     });
  //   });
  //
  //   it('uses a table name as a string and references the author table', () => {
  //     const authorIdColumn = {type: Sequelize.INTEGER, references: {model: 'authors', key: 'id'}};
  //
  //     const self = this
  //       , Post = self.sequelize.define('post', {title: Sequelize.STRING, authorId: authorIdColumn});
  //
  //     this.Author.hasMany(Post);
  //     Post.belongsTo(this.Author);
  //
  //     // The posts table gets dropped in the before filter.
  //     return Post.sync({
  //       logging: _.once((sql) => {
  //         if (dialect === 'postgres') {
  //           expect(sql).to.match(/"authorId" INTEGER REFERENCES "authors" \("id"\)/);
  //         } else if (dialect === 'mysql') {
  //           expect(sql).to.match(/FOREIGN KEY \(`authorId`\) REFERENCES `authors` \(`id`\)/);
  //         } else if (dialect === 'sqlite') {
  //           expect(sql).to.match(/`authorId` INTEGER REFERENCES `authors` \(`id`\)/);
  //         } else if (dialect === 'mssql') {
  //           expect(sql).to.match(/FOREIGN KEY \(\[authorId\]\) REFERENCES \[authors\] \(\[id\]\)/);
  //         } else {
  //           throw new Error('Undefined dialect!');
  //         }
  //       })
  //     });
  //   });
  //
  //   it('emits an error event as the referenced table name is invalid', () => {
  //     const authorIdColumn = {type: Sequelize.INTEGER, references: {model: '4uth0r5', key: 'id'}};
  //
  //     const Post = this.sequelize.define('post', {title: Sequelize.STRING, authorId: authorIdColumn});
  //
  //     this.Author.hasMany(Post);
  //     Post.belongsTo(this.Author);
  //
  //     // The posts table gets dropped in the before filter.
  //     return Post.sync().then(() => {
  //       if (dialect === 'sqlite') {
  //         // sorry ... but sqlite is too stupid to understand whats going on ...
  //         expect(1).to.equal(1);
  //       } else {
  //         // the parser should not end up here ...
  //         expect(2).to.equal(1);
  //       }
  //
  //       return;
  //     }).catch((err) => {
  //       if (dialect === 'mysql') {
  //         // MySQL 5.7 or above doesn't support POINT EMPTY
  //         if (dialect === 'mysql' && semver.gte(current.options.databaseVersion, '5.6.0')) {
  //           expect(err.message).to.match(/Cannot add foreign key constraint/);
  //         } else {
  //           expect(err.message).to.match(/Can\'t create table/);
  //         }
  //       } else if (dialect === 'sqlite') {
  //         // the parser should not end up here ... see above
  //         expect(1).to.equal(2);
  //       } else if (dialect === 'postgres') {
  //         expect(err.message).to.match(/relation "4uth0r5" does not exist/);
  //       } else if (dialect === 'mssql') {
  //         expect(err.message).to.match(/Could not create constraint/);
  //       } else {
  //         throw new Error('Undefined dialect!');
  //       }
  //     });
  //   });
  //
  //   it('works with comments', () => {
  //     // Test for a case where the comment was being moved to the end of the table when there was also a reference on the column, see #1521
  //     // jshint ignore:start
  //     const Member = this.sequelize.define('Member', {});
  //     const idColumn = {
  //       type: Sequelize.INTEGER,
  //       primaryKey: true,
  //       autoIncrement: false,
  //       comment: 'asdf'
  //     };
  //
  //     idColumn.references = {model: Member, key: 'id'};
  //
  //     const Profile = this.sequelize.define('Profile', {id: idColumn});
  //     // jshint ignore:end
  //
  //     return this.sequelize.sync({force: true});
  //   });
  // });
  //
  // describe('blob', () => {
  //   beforeEach(() => {
  //     this.BlobUser = this.sequelize.define('blobUser', {
  //       data: Sequelize.BLOB
  //     });
  //
  //     return this.BlobUser.sync({force: true});
  //   });
  //
  //   describe('buffers', () => {
  //     it('should be able to take a buffer as parameter to a BLOB field', () => {
  //       return this.BlobUser.create({
  //         data: new Buffer('Sequelize')
  //       }).then((user) => {
  //         expect(user).to.be.ok;
  //       });
  //     });
  //
  //     it('should return a buffer when fetching a blob', () => {
  //       const self = this;
  //       return this.BlobUser.create({
  //         data: new Buffer('Sequelize')
  //       }).then((user) => {
  //         return self.BlobUser.findById(user.id).then((user) => {
  //           expect(user.data).to.be.an.instanceOf(Buffer);
  //           expect(user.data.toString()).to.have.string('Sequelize');
  //         });
  //       });
  //     });
  //
  //     it('should work when the database returns null', () => {
  //       const self = this;
  //       return this.BlobUser.create({
  //         // create a null column
  //       }).then((user) => {
  //         return self.BlobUser.findById(user.id).then((user) => {
  //           expect(user.data).to.be.null;
  //         });
  //       });
  //     });
  //   });
  //
  //   if (dialect !== 'mssql') {
  //     // NOTE: someone remember to inform me about the intent of these tests. Are
  //     //       you saying that data passed in as a string is automatically converted
  //     //       to binary? i.e. "Sequelize" is CAST as binary, OR that actual binary
  //     //       data is passed in, in string form? Very unclear, and very different.
  //
  //     describe('strings', () => {
  //       it('should be able to take a string as parameter to a BLOB field', () => {
  //         return this.BlobUser.create({
  //           data: 'Sequelize'
  //         }).then((user) => {
  //           expect(user).to.be.ok;
  //         });
  //       });
  //
  //       it('should return a buffer when fetching a BLOB, even when the BLOB was inserted as a string', () => {
  //         const self = this;
  //         return this.BlobUser.create({
  //           data: 'Sequelize'
  //         }).then((user) => {
  //           return self.BlobUser.findById(user.id).then((user) => {
  //             expect(user.data).to.be.an.instanceOf(Buffer);
  //             expect(user.data.toString()).to.have.string('Sequelize');
  //           });
  //         });
  //       });
  //     });
  //   }
  //
  // });
  //
  // describe('paranoid is true and where is an array', () => {
  //
  //   beforeEach(() => {
  //     MainUser = this.sequelize.define('User', {username: DataTypes.STRING}, {paranoid: true});
  //     this.Project = this.sequelize.define('Project', {title: DataTypes.STRING}, {paranoid: true});
  //
  //     this.Project.belongsToMany(MainUser, {through: 'project_user'});
  //     MainUser.belongsToMany(this.Project, {through: 'project_user'});
  //
  //     const self = this;
  //     return this.sequelize.sync({force: true}).then(() => {
  //       return self.User.bulkCreate([{
  //         username: 'leia'
  //       }, {
  //         username: 'luke'
  //       }, {
  //         username: 'vader'
  //       }]).then(() => {
  //         return self.Project.bulkCreate([{
  //           title: 'republic'
  //         }, {
  //           title: 'empire'
  //         }]).then(() => {
  //           return self.User.findAll().then((users) => {
  //             return self.Project.findAll().then((projects) => {
  //               const leia = users[0]
  //                 , luke = users[1]
  //                 , vader = users[2]
  //                 , republic = projects[0]
  //                 , empire = projects[1];
  //               return leia.setProjects([republic]).then(() => {
  //                 return luke.setProjects([republic]).then(() => {
  //                   return vader.setProjects([empire]).then(() => {
  //                     return leia.destroy();
  //                   });
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  //
  //   it('should not fail when array contains Sequelize.or / and', () => {
  //     return MainUser.findAll({
  //       where: [
  //         this.sequelize.or({username: 'vader'}, {username: 'luke'}),
  //         this.sequelize.and({id: [1, 2, 3]})
  //       ]
  //     })
  //       .then((res) => {
  //         expect(res).to.have.length(2);
  //       });
  //   });
  //
  //   it('should not fail with an include', () => {
  //     return MainUser.findAll({
  //       where: [
  //         this.sequelize.queryInterface.QueryGenerator.quoteIdentifiers('Projects.title') + ' = ' + this.sequelize.queryInterface.QueryGenerator.escape('republic')
  //       ],
  //       include: [
  //         {model: this.Project}
  //       ]
  //     }).then((users) => {
  //       expect(users.length).to.be.equal(1);
  //       expect(users[0].username).to.be.equal('luke');
  //     });
  //   });
  //
  //   it('should not overwrite a specified deletedAt by setting paranoid: false', () => {
  //     const tableName = '';
  //     if (MainUser.name) {
  //       tableName = this.sequelize.queryInterface.QueryGenerator.quoteIdentifier(MainUser.name) + '.';
  //     }
  //     return MainUser.findAll({
  //       paranoid: false,
  //       where: [
  //         tableName + this.sequelize.queryInterface.QueryGenerator.quoteIdentifier('deletedAt') + ' IS NOT NULL '
  //       ],
  //       include: [
  //         {model: this.Project}
  //       ]
  //     }).then((users) => {
  //       expect(users.length).to.be.equal(1);
  //       expect(users[0].username).to.be.equal('leia');
  //     });
  //   });
  //
  //   it('should not overwrite a specified deletedAt (complex query) by setting paranoid: false', () => {
  //     return MainUser.findAll({
  //       paranoid: false,
  //       where: [
  //         this.sequelize.or({username: 'leia'}, {username: 'luke'}),
  //         this.sequelize.and(
  //           {id: [1, 2, 3]},
  //           this.sequelize.or({deletedAt: null}, {deletedAt: {gt: new Date(0)}})
  //         )
  //       ]
  //     })
  //       .then((res) => {
  //         expect(res).to.have.length(2);
  //       });
  //   });
  //
  // });
  //
  // if (dialect !== 'sqlite' && current.dialect.supports.transactions) {
  //   it('supports multiple async transactions', () => {
  //     this.timeout(90000);
  //     const self = this;
  //     return Support.prepareTransactionTest(this.sequelize).bind({}).then((sequelize) => {
  //       const User = sequelize.define('User', {username: Sequelize.STRING});
  //       const testAsync = () => {
  //         return sequelize.transaction().then((t) => {
  //           return User.create({
  //             username: 'foo'
  //           }, {
  //             transaction: t
  //           }).then(() => {
  //             return User.findAll({
  //               where: {
  //                 username: 'foo'
  //               }
  //             }).then((users) => {
  //               expect(users).to.have.length(0);
  //             });
  //           }).then(() => {
  //             return User.findAll({
  //               where: {
  //                 username: 'foo'
  //               },
  //               transaction: t
  //             }).then((users) => {
  //               expect(users).to.have.length(1);
  //             });
  //           }).then(() => {
  //             return t;
  //           });
  //         }).then((t) => {
  //           return t.rollback();
  //         });
  //       };
  //       return User.sync({force: true}).then(() => {
  //         const tasks = [];
  //         for (const i = 0; i < 1000; i++) {
  //           tasks.push(testAsync.bind(this));
  //         }
  //         return self.sequelize.Promise.resolve(tasks).map((entry) => {
  //           return entry();
  //         }, {
  //           // Needs to be one less than ??? else the non transaction query won't ever get a connection
  //           concurrency: (sequelize.config.pool && sequelize.config.pool.max || 5) - 1
  //         });
  //       });
  //     });
  //   });
  // }
  //
  // describe('Unique', () => {
  //   it('should set unique when unique is true', () => {
  //     const self = this;
  //     const uniqueTrue = self.sequelize.define('uniqueTrue', {
  //       str: {type: Sequelize.STRING, unique: true}
  //     });
  //
  //     return uniqueTrue.sync({
  //       force: true, logging: _.after(2, _.once((s) => {
  //         expect(s).to.match(/UNIQUE/);
  //       }))
  //     });
  //   });
  //
  //   it('should not set unique when unique is false', () => {
  //     const self = this;
  //     const uniqueFalse = self.sequelize.define('uniqueFalse', {
  //       str: {type: Sequelize.STRING, unique: false}
  //     });
  //
  //     return uniqueFalse.sync({
  //       force: true, logging: _.after(2, _.once((s) => {
  //         expect(s).not.to.match(/UNIQUE/);
  //       }))
  //     });
  //   });
  //
  //   it('should not set unique when unique is unset', () => {
  //     const self = this;
  //     const uniqueUnset = self.sequelize.define('uniqueUnset', {
  //       str: {type: Sequelize.STRING}
  //     });
  //
  //     return uniqueUnset.sync({
  //       force: true, logging: _.after(2, _.once((s) => {
  //         expect(s).not.to.match(/UNIQUE/);
  //       }))
  //     });
  //   });
  // });
  //
  // it('should be possible to use a key named UUID as foreign key', () => {
  //   // jshint ignore:start
  //   const project = this.sequelize.define('project', {
  //     UserId: {
  //       type: Sequelize.STRING,
  //       references: {
  //         model: 'Users',
  //         key: 'UUID'
  //       }
  //     }
  //   });
  //
  //   const user = this.sequelize.define('Users', {
  //     UUID: {
  //       type: Sequelize.STRING,
  //       primaryKey: true,
  //       unique: true,
  //       allowNull: false,
  //       validate: {
  //         notNull: true,
  //         notEmpty: true
  //       }
  //     }
  //   });
  //   // jshint ignore:end
  //
  //   return this.sequelize.sync({force: true});
  // });
  //
  // describe('bulkCreate errors', () => {
  //   it('should return array of errors if validate and individualHooks are true', () => {
  //     const data = [{username: null},
  //       {username: null},
  //       {username: null}];
  //
  //     const user = this.sequelize.define('Users', {
  //       username: {
  //         type: Sequelize.STRING,
  //         allowNull: false,
  //         validate: {
  //           notNull: true,
  //           notEmpty: true
  //         }
  //       }
  //     });
  //
  //     return expect(user.bulkCreate(data, {
  //       validate: true,
  //       individualHooks: true
  //     })).to.be.rejectedWith(Promise.AggregateError);
  //   });
  // });
});
