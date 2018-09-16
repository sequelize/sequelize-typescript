import {BaseSequelizeOptions} from '../sequelize-options/base-sequelize-options';

export interface ISequelizeValidationOnlyOptions extends BaseSequelizeOptions {

  /**
   * Makes it possible to use sequelize for validation only
   * (no db connection is needed)
   */
  validateOnly: true;
}
