import {Sequelize} from "../../lib/models/Sequelize";
import * as OriginSequelize from "sequelize";
import {DefineOptions, Sequelize as SequelizeType} from "sequelize";


export function createSequelize(useModelsInPath: boolean = true, define: DefineOptions<any> = {}): Sequelize {

  return new Sequelize({
    database: '__',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    define,
    storage: ':memory:',
    logging: !('SEQ_SILENT' in process.env),
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : []
  });
}

export function createSequelizeUriObject(useModelsInPath: boolean = true, define: DefineOptions<any> = {}): Sequelize {

  return new Sequelize({
    uri: 'sqlite://root@localhost/__',
    dialect: 'sqlite',
    define,
    storage: ':memory:',
    logging: !('SEQ_SILENT' in process.env),
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : []
  });
}
export function createSequelizeUriString(useModelsInPath: boolean = true, define: DefineOptions<any> = {}): Sequelize {

  return new Sequelize("sqlite://root@localhost/__");
}

export function createSequelizeValidationOnly(useModelsInPath: boolean = true): Sequelize {

  return new Sequelize({
    validateOnly: true,
    logging: !('SEQ_SILENT' in process.env),
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : []
  });
}

export function createOriginSequelize(): SequelizeType {

  return new OriginSequelize('___', 'root', '', {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: !('SEQ_SILENT' in process.env)
  });
}
