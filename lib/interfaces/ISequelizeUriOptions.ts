import {Options} from 'sequelize';
import {Model} from '../models/Model';

export interface ISequelizeUriOptions extends Options {

  /**
   * Uri connection string to database
   */
  url: string;

  /**
   * Path to models, which should be loaded
   */
  models?: string[] | Array<typeof Model>;

  /**
   * Makes it possible to use sequelize for validation only
   * if set to true. For this configuration it is always false.
   * See ISequelizeValidationOnlyConfig interface
   */
  validateOnly?: false;
}
