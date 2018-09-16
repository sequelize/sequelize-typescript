import {ISequelizeUriOptions} from './interfaces/ISequelizeUriOptions';
import {SequelizeOptions} from './types/SequelizeOptions';
import {DEFAULT_DEFINE_OPTIONS} from '../model/shared/model-service';
import {ISequelizeOptions} from './interfaces/ISequelizeOptions';

export function hasSequelizeUri(obj: any): obj is ISequelizeUriOptions {
  return obj.hasOwnProperty("url");
}

/**
 * Prepares sequelize config passed to original sequelize constructor
 */
export function prepareOptions(options: SequelizeOptions): SequelizeOptions {
  if (!options.define) {
    options.define = {};
  }
  options.define = {...DEFAULT_DEFINE_OPTIONS, ...options.define};

  if (options.validateOnly) {
    return getValidationOnlyOptions(options);
  }
  return {...options as SequelizeOptions};
}

function getValidationOnlyOptions(options: SequelizeOptions): ISequelizeOptions {
  return {
    ...options,
    database: '_name_',
    username: '_username_',
    password: '_password_',
    dialect: 'sqlite',
    dialectModulePath: __dirname + '/db-dialect-dummy'
  } as ISequelizeOptions;
}
