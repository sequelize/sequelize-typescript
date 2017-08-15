import {Options} from 'sequelize';

/**
 * This class is for deprecated "name" property.
 * For cPlease
 */
export interface ISequelizeDbNameConfig extends Options {

  /**
   * Name of database
   * @TODO: name is deprecated. Use database instead.
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
   * Path to models, which should be loaded
   */
  modelPaths?: string[];

  /**
   * Makes it possible to use sequelize for validation only
   * if set to true. For this configuration it is always false.
   * See ISequelizeValidationOnlyConfig interface
   */
  validateOnly?: false;
}
