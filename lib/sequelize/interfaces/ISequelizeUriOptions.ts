import {Options} from 'sequelize';
import {Model} from '../../model/models/Model';
import {ModelMatch} from '../types/SequelizeOptions';

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
