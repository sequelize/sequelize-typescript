import { Sequelize } from '../../src/sequelize/sequelize/sequelize';
import { ModelOptions, Op } from 'sequelize';
import { SequelizeOptions } from '../../src/sequelize/sequelize/sequelize-options';

export function createSequelize(partialOptions: Partial<SequelizeOptions>): Sequelize;
export function createSequelize(useModelsInPath?: boolean, define?: ModelOptions<any>): Sequelize;
export function createSequelize(
  useModelsInPathOrPartialOptions?: boolean | Partial<SequelizeOptions>,
  define: ModelOptions<any> = {}
): Sequelize {
  let useModelsInPath = true;
  let partialOptions = {};
  if (typeof useModelsInPathOrPartialOptions === 'object') {
    partialOptions = useModelsInPathOrPartialOptions;
  } else if (typeof useModelsInPathOrPartialOptions === 'boolean') {
    useModelsInPath = useModelsInPathOrPartialOptions;
  }

  return new Sequelize({
    operatorsAliases: Op,
    database: '__',
    dialect: 'sqlite' as const,
    username: 'root',
    password: '',
    define,
    storage: ':memory:',
    logging: !('DISABLE_LOGGING' in process.env),
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : [],
    ...partialOptions,
  });
}

export function createSequelizeValidationOnly(useModelsInPath = true): Sequelize {
  return new Sequelize({
    operatorsAliases: Op,
    validateOnly: true,
    logging: !('DISABLE_LOGGING' in process.env),
    models: useModelsInPath ? [__dirname + '/../models'] : [],
  });
}

export function createSequelizeFromUri(useModelsInPath = true): Sequelize {
  const sequelize = new Sequelize('sqlite://');
  sequelize.addModels(useModelsInPath ? [__dirname + '/../models'] : []);

  return sequelize;
}

export function createSequelizeFromUriObject(useModelsInPath = true): Sequelize {
  return new Sequelize('sqlite://', {
    operatorsAliases: Op,
    modelPaths: useModelsInPath ? [__dirname + '/../models'] : [],
  });
}
