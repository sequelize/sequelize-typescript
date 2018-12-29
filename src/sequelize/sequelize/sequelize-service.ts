import {SequelizeUriOptions} from '../sequelize-options/sequelize-uri-options';
import {SequelizeOptions} from '../sequelize-options/sequelize-options';
import {DEFAULT_DEFINE_OPTIONS} from '../../model/shared/model-service';
import {SequelizeNonUriOptions} from '../sequelize-options/sequelize-non-uri-options';

export function hasSequelizeUri(obj: any): obj is SequelizeUriOptions {
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

function getValidationOnlyOptions(options: SequelizeOptions): SequelizeNonUriOptions {
  return {
    ...options,
    database: '_name_',
    username: '_username_',
    password: '_password_',
    dialect: 'sqlite',
    dialectModulePath: __dirname + '/../validation-only/db-dialect-dummy'
  } as SequelizeNonUriOptions;
}
