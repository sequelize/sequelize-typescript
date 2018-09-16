import {Sequelize} from "../../lib/sequelize/shared/sequelize";
import * as OriginSequelize from "sequelize";
import {DefineOptions, Sequelize as SequelizeType} from "sequelize";
import {SequelizeOptions} from '../../lib/sequelize/sequelize-options/sequelize-options';

export function createSequelize(partialOptions: Partial<SequelizeOptions>): Sequelize;
export function createSequelize(useModelsInPath?: boolean,
                                define?: DefineOptions<any>): Sequelize;
export function createSequelize(useModelsInPathOrPartialOptions?: boolean | Partial<SequelizeOptions>,
                                define: DefineOptions<any> = {}): Sequelize {

  let useModelsInPath = true;
  let partialOptions = {};
  if (typeof useModelsInPathOrPartialOptions === 'object') {
    partialOptions = useModelsInPathOrPartialOptions;
  } else if (typeof useModelsInPathOrPartialOptions === 'boolean') {
    useModelsInPath = useModelsInPathOrPartialOptions;
  }

  return new Sequelize({
    database: '__',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    define,
    storage: ':memory:',
    logging: !('SEQ_SILENT' in process.env),
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : [],
    ...partialOptions,
  });
}

export function createSequelizeValidationOnly(useModelsInPath: boolean = true): Sequelize {

  return new Sequelize({
    validateOnly: true,
    logging: !('SEQ_SILENT' in process.env),
    models: useModelsInPath ? [__dirname + '/../models'] : []
  });
}

export function createSequelizeFromUri(useModelsInPath: boolean = true): Sequelize {
  const sequelize = new Sequelize('sqlite://');
  sequelize.addModels(useModelsInPath ? [__dirname + '/../models'] : []);

  return sequelize;
}

export function createSequelizeFromUriObject(useModelsInPath: boolean = true): Sequelize {
  return new Sequelize({
    url: 'sqlite://',
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
