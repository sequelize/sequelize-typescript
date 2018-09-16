import {Options} from 'sequelize';
import {Model} from '../../model/model/model';
import {ModelMatch} from '../types/SequelizeOptions';

export interface ISequelizeValidationOnlyOptions extends Options {

  /**
   * Makes it possible to use sequelize for validation only
   * (no db connection is needed)
   */
  validateOnly: true;

  /**
   * Path to models, which should be loaded
   */
  models?: string[] | Array<typeof Model>;

  /**
   * Matches models by filename using a custom function.
   * @default (filename, member) => filename === member
   */
  modelMatch?: ModelMatch;
}
