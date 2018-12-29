import {BaseSequelizeOptions} from "./base-sequelize-options";

/**
 * Configuration for using SQLite only with the dialect option
 */
export interface SequelizeStorageOptions extends BaseSequelizeOptions {
  /**
   * The dialect of the database you are connecting to. One of mysql, postgres, sqlite, mariadb and mssql.
   *
   * If 'sqlite' is used, only passing the dialect is valid (':memory:' will be used for storage, but this can be changed)
   */
  dialect: 'sqlite';

  /**
   * Makes it possible to use sequelize for validation only
   * if set to true. For this configuration it is always false.
   * See ISequelizeValidationOnlyConfig interface
   */
  validateOnly?: false;
}
