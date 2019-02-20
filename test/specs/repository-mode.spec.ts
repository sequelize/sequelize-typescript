import {expect} from 'chai';
import {Op} from 'sequelize';

import {BelongsToMany} from "../../src/associations/belongs-to-many/belongs-to-many";
import {Table} from "../../src/model/table/table";
import {Sequelize} from "../../src/sequelize/sequelize/sequelize";
import {Column} from "../../src/model/column/column";
import {Model} from "../../src/model/model/model";
import {HasMany} from "../../src/associations/has/has-many";
import {HasOne} from "../../src/associations/has/has-one";
import {ForeignKey} from "../../src/associations/foreign-key/foreign-key";
import {BelongsTo} from "../../src/associations/belongs-to/belongs-to";
import { SequelizeOptions } from '../../src';

describe('repository-mode', () => {

  const defaultOptions: Partial<SequelizeOptions> = {
    dialect: 'sqlite',
    username: 'root',
    password: '',
    logging: !!process.env.SEQ_SILENT,
    repositoryMode: true,
  };

  describe('simple setup', () => {

    @Table
    class User extends Model<User> {
      @Column name: string;
      @Column birthday: Date;
    }

    let sequelizeA: Sequelize;
    let sequelizeB: Sequelize;

    before(async () => {
      sequelizeA = new Sequelize({
        operatorsAliases: Op,
        ...defaultOptions,
        database: 'a',
        models: [User],
      });
      sequelizeB = new Sequelize({
        operatorsAliases: Op,
        ...defaultOptions,
        database: 'b',
        models: [User],
      });
    });

    beforeEach(async () => {
      await sequelizeA.sync({force: true});
      await sequelizeB.sync({force: true});
    });

    it('should successfully retrieve repository', () => {
      let UserRepositoryA;
      let UserRepositoryB;
      expect(() => UserRepositoryA = sequelizeA.getRepository(User)).to.not.throw();
      expect(() => UserRepositoryB = sequelizeB.getRepository(User)).to.not.throw();
      expect(UserRepositoryA).to.be.ok;
      expect(UserRepositoryB).to.be.ok;
    });

    it('should not initialize actual model class', () => {
      expect(User).to.have.property('isInitialized', false);
    });

    it('should be able to create instance of model via repository', async () => {
      const UserRepository = sequelizeA.getRepository(User);
      const user = await UserRepository.create({name: 'Han Solo'});

      expect(user).to.be.an.instanceOf(User);
      expect(user.name).to.eql('Han Solo');
    });

    it('should not affect sequelize instance B if an instance is stored via sequelize instance A', async () => {
      const userA = await sequelizeA.getRepository(User).create({name: 'Han Solo'});
      const userB = await sequelizeB.getRepository(User).findByPk(userA.id);

      expect(userB).to.be.null;
    });

  });

  describe('associations', () => {

    describe('one-to-one', () => {

      type _Address = Partial<Address>;

      @Table
      class User extends Model<User> {
        @Column name: string;
        @Column birthday: Date;
        @HasOne(() => Address) address: _Address;
      }

      @Table
      class Address extends Model<Address> {
        @Column street: string;
        @Column city: string;
        @ForeignKey(() => User) userId: number;
        @BelongsTo(() => User) user: User;
      }

      let sequelize: Sequelize;

      before(async () => {
        sequelize = new Sequelize({
          operatorsAliases: Op,
          ...defaultOptions,
          database: 'a',
          models: [User, Address],
        });
      });

      beforeEach(async () => {
        await sequelize.sync({force: true});
      });

      it('should not initialize actual model class', () => {
        expect(User).to.have.property('isInitialized', false);
        expect(Address).to.have.property('isInitialized', false);
      });

      it('should create user with associated model', async () => {
        const user = await sequelize.getRepository(User).create({
          name: 'Sherlock Holmes',
          birthday: new Date(),
          address: {street: 'Bakerstreet', city: 'London'},
        }, {include: [sequelize.getRepository(Address) as any]});

        expect(user.address).to.have.property('street', 'Bakerstreet');
        expect(user.address).to.have.property('city', 'London');
      });

    });

    describe('one-to-many', () => {

      @Table
      class User extends Model<User> {
        @Column name: string;
        @Column birthday: Date;

        @HasMany(() => Comment)
        comments: Array<{ text: string }>;
      }

      @Table
      class Comment extends Model<Comment> {
        @Column text: string;

        @ForeignKey(() => User)
        userId: number;

        @BelongsTo(() => User)
        user: User;
      }

      let sequelizeA: Sequelize;
      let sequelizeB: Sequelize;

      before(async () => {
        sequelizeA = new Sequelize({
          operatorsAliases: Op,
          ...defaultOptions,
          database: 'a',
          repositoryMode: true,
          logging: !!process.env.SEQ_SILENT,
          models: [User, Comment],
        });
        sequelizeB = new Sequelize({
          operatorsAliases: Op,
          ...defaultOptions,
          database: 'b',
          repositoryMode: true,
          logging: !!process.env.SEQ_SILENT,
          models: [User, Comment],
        });
      });

      beforeEach(async () => {
        await sequelizeA.sync({force: true});
        await sequelizeB.sync({force: true});
      });

      it('should not initialize actual model classes', () => {
        expect(User).to.have.property('isInitialized', false);
        expect(Comment).to.have.property('isInitialized', false);
      });

      it('should be able to create instance of each model via repository', async () => {
        const userRepository = sequelizeA.getRepository(User);
        const commentRepository = sequelizeA.getRepository(Comment);
        const user = await userRepository.create({name: 'Han Solo'});
        const comment = await commentRepository.create({text: 'I shot first!'});

        expect(user).to.be.an.instanceOf(User);
        expect(comment).to.be.an.instanceOf(Comment);
      });

      it('should be able to create instance of model using "include" via repository', async () => {
        const userRepository = sequelizeA.getRepository(User);
        const commentRepository = sequelizeA.getRepository(Comment);
        const user = await userRepository.create({
          name: 'Han Solo',
          comments: [{
            text: 'I shot first!',
          }],
        }, {include: [commentRepository]});

        expect(user).to.be.an.instanceOf(User);
        expect(user).to.have.property('comments');
      });

    });

    describe('many-to-many', () => {

      @Table
      class UserEvent extends Model<UserEvent> {
        @ForeignKey(() => User) @Column userId: number;
        @ForeignKey(() => Event) @Column eventId: number;
      }

      @Table
      class Event extends Model<Event> {
        @Column name: string;
        @BelongsToMany(() => User, () => UserEvent) users: any[];
      }

      @Table
      class User extends Model<User> {
        @Column name: string;
        @BelongsToMany(() => Event, () => UserEvent) events: Event[];
      }

      let sequelizeA: Sequelize;
      let sequelizeB: Sequelize;

      before(async () => {
        sequelizeA = new Sequelize({
          operatorsAliases: Op,
          ...defaultOptions,
          database: 'a',
          repositoryMode: true,
          logging: !!process.env.SEQ_SILENT,
          models: [User, Event, UserEvent],
        });
        sequelizeB = new Sequelize({
          operatorsAliases: Op,
          ...defaultOptions,
          database: 'b',
          repositoryMode: true,
          logging: !!process.env.SEQ_SILENT,
          models: [User, Event, UserEvent],
        });
      });

      beforeEach(async () => {
        await sequelizeA.sync({force: true});
        await sequelizeB.sync({force: true});
      });

      it('should not initialize actual model classes', () => {
        expect(User).to.have.property('isInitialized', false);
        expect(Event).to.have.property('isInitialized', false);
        expect(UserEvent).to.have.property('isInitialized', false);
      });

      it('should be able to create instance of model using "include" via repository', async () => {
        const userRepository = sequelizeA.getRepository(User);
        const eventRepository = sequelizeA.getRepository(Event);
        const user = await userRepository.create({
          name: 'Han Solo',
          events: [{
            name: 'Defeat the Empire',
          }],
        }, {include: [eventRepository]});

        expect(user).to.be.an.instanceOf(User);
        expect(user).to.have.property('events');
      });

    });

  });


});
