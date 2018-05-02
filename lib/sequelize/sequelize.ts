import {ISequelizeUriOptions} from './interfaces/ISequelizeUriOptions';
import {SequelizeOptions} from './types/SequelizeOptions';
import {DEFAULT_DEFINE_OPTIONS} from '../model/models';
import {ISequelizeOptions} from './interfaces/ISequelizeOptions';

export function hasSequelizeUri(obj: any): obj is ISequelizeUriOptions {
  return obj.hasOwnProperty("url");
}

/**
 * Prepares sequelize config passed to original sequelize constructor
 */
export function prepareOptions(config: SequelizeOptions): SequelizeOptions {
  if (!config.define) {
    config.define = {};
  }
  config.define = {...DEFAULT_DEFINE_OPTIONS, ...config.define};

  if (config.validateOnly) {
    return getValidationOnlyConfig(config);
  }
  return {...config as SequelizeOptions};
}

function getValidationOnlyConfig(config: SequelizeOptions): ISequelizeOptions {
  return {
    ...config,
    database: '_name_',
    username: '_username_',
    password: '_password_',
    dialect: 'sqlite',
    dialectModulePath: __dirname + '/db-dialect-dummy'
  } as ISequelizeOptions;
}
