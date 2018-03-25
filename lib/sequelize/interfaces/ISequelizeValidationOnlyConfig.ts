import {Options} from 'sequelize';
import {Model} from '../../model/models/Model';

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
}
