import {Sequelize} from "../../lib/models/Sequelize";

export function createSequelize(): Sequelize {

  return new Sequelize({
    name: 'blog',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    logging: !('SEQ_SILENT' in process.env),
    modelPaths: [__dirname + '/../models']
  });
}
