import {Options} from 'sequelize';
import {ModelMatch} from '../types/SequelizeConfig';

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

  /**
   * Matches models by filename using a custom function.
   * @default (filename, member) => filename === member
   */
  modelMatch?: ModelMatch;
}
