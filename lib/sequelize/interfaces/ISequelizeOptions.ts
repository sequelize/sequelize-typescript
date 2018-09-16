import {Options} from 'sequelize';
import {Model} from '../../model/model/model';
import {ModelMatch} from '../types/SequelizeOptions';

/**
 * This class is dedicated for deprecated "name" property.
 * For congruence to Sequelize config, use "database" instead.
 */
export interface ISequelizeOptions extends Options {

  /**
   * Name of database
   * @deprecated: name is deprecated. Use database instead.
   */
  name: string;

  /**
   * Username of database
   */
  username: string;

  /**
   * Password for database user
   */
  password: string;

  /**
   * Path to models or actual models,
   * which should be loaded for sequelize instance
   */
  models?: string[] | Array<typeof Model>;

  /**
   * Matches models by filename using a custom function.
   * @default (filename, member) => filename === member
   */
  modelMatch?: ModelMatch;

  /**
   * Makes it possible to use sequelize for validation only
   * if set to true. For this configuration it is always false.
   * See ISequelizeValidationOnlyConfig interface
   */
  validateOnly?: false;
}
