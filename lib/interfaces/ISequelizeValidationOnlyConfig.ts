import {Options} from 'sequelize';

export interface ISequelizeValidationOnlyConfig extends Options {

  /**
   * Makes it possible to use sequelize for validation only
   * (no db connection is needed)
   */
  validateOnly: true;

  /**
   * Path to models, which should be loaded
   */
  modelPaths?: string[];
}
