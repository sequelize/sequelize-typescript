import {Options} from 'sequelize';
import {Model} from '../../model/models/Model';

export interface ISequelizeOptions extends Options {

  /**
   * Name of database
   */
  database: string;

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
   * Makes it possible to use sequelize for validation only
   * if set to true. For this configuration it is always false.
   * See ISequelizeValidationOnlyConfig interface
   */
  validateOnly?: false;
}
