import {Options} from 'sequelize';
import {ModelMatch} from '../types/SequelizeConfig';

export interface ISequelizeConfig extends Options {

  /**
   * Name of database
   */
  database: string;

  /**
   * Username of database
   */
  username?: string;

  /**
   * Password for database user
   */
  password?: string;

  /**
   * Path to models, which should be loaded
   */
  modelPaths?: string[];

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
