import {Options} from 'sequelize';

export interface ISequelizeValidationOnlyConfig extends Options {

  /**
   * Makes it possible to use sequelize for validation only
   * (no db connection is needed)
   */
  validateOnly: boolean;

  /**
   * Path to models, which should be loaded
   */
  modelPaths?: string[];
}
