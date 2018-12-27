import {expect} from 'chai';
import {Sequelize} from "../../src/sequelize";
import {Model} from "../../src/model";
import {Table} from "../../src/model/table/table";
import {Column} from "../../src/model/column/column";

describe('repository-mode', () => {

  describe('simple setup', () => {

    const defaultOptions = {dialect: 'sqlite', username: 'root', password: ''};

    @Table
    class User extends Model<User> {
      @Column name: string;
      @Column birthday: Date;
    }

    let sequelizeA: Sequelize;
    let sequelizeB: Sequelize;

    before(async () => {
      sequelizeA = new Sequelize({
        ...defaultOptions,
        database: 'a',
        repositoryMode: true,
        logging: !!process.env.SEQ_SILENT,
        models: [User],
      });
      sequelizeB = new Sequelize({
        ...defaultOptions,
        database: 'b',
        repositoryMode: true,
        logging: !!process.env.SEQ_SILENT,
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
    });

    it('should not affect sequelize instance B if an instance is stored via sequelize instance A', async () => {
      const userA = await sequelizeA.getRepository(User).create({name: 'Han Solo'});
      const userB = await sequelizeB.getRepository(User).findById(userA.id);

      expect(userB).to.be.null;
    });

  });

});
