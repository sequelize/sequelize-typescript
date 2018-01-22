import {Options} from 'sequelize';

/**
 * This class is dedicated for deprecated "name" property.
 * For congruence to Sequelize config, use "database" instead.
 */
export interface ISequelizeDbNameConfig extends Options {

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
   * Path to models, which should be loaded
   */
  modelPaths?: string[];

  /**
   * Makes it possible to use sequelize for validation only
   * if set to true. For this configuration it is always false.
   * See ISequelizeValidationOnlyConfig interface
   */
  validateOnly?: boolean;
}
