import {Options} from 'sequelize';

export interface ISequelizeUriConfig extends Options {

  /**
   * Uri connection string to database
   */
  uri: string;

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
