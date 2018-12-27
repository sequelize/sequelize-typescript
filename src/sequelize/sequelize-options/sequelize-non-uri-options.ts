import {BaseSequelizeOptions} from './base-sequelize-options';

/**
 * This class is dedicated for deprecated "name" property.
 * For congruence to Sequelize config, use "database" instead.
 */
export interface SequelizeNonUriOptions extends BaseSequelizeOptions {
  
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
   * Makes it possible to use sequelize for validation only
   * if set to true. For this configuration it is always false.
   * See ISequelizeValidationOnlyConfig interface
   */
  validateOnly?: false;
}
