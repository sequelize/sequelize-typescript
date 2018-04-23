import { createSequelize } from "../../utils/sequelize";
import {expect} from 'chai';
import { Book } from "../../models/Book";
import { Page } from "../../models/Page";
import { Sequelize } from "../../..";
import { Box } from "../../models/Box";


describe('repository-mode', () => {

  const sequelizeRM = createSequelize(
    {
      repositoryMode : false,
      modelPaths : null
    });
  sequelizeRM.addModels([Book, Page]);

  const sequelize = createSequelize(false);
  sequelize.addModels([Book, Page]);

  it('should return true if models have same table name', () => {
      expect(Book.getTableName()).to.be.eq(sequelizeRM.getRepository(Book).getTableName());
  });

});
