import {Sequelize} from "../../lib/models/Sequelize";
import * as OriginSequelize from "sequelize";
import {Sequelize as SequelizeType} from "sequelize";

export function createSequelize(): Sequelize {

  return new Sequelize({
    name: '__',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    logging: !('SEQ_SILENT' in process.env),
    modelPaths: [__dirname + '/../models']
  });
}

export function createOriginSequelize(): SequelizeType {

  return new OriginSequelize('___', 'root', '', {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: !('SEQ_SILENT' in process.env)
  });
}
