import {Options} from 'sequelize';
import {ModelMatch} from './sequelize-options';
import {Model} from '../../model/index';

export interface BaseSequelizeOptions extends Options {

  /**
   * Path to models or actual models,
   * which should be loaded for sequelize instance
   */
  models?: string[] | Array<typeof Model>;

  /**
   * Path to models, which should be loaded
   * @deprecated
   */
  modelPaths?: string[];

  /**
   * Matches models by filename using a custom function.
   * @default (filename, member) => filename === member
   */
  modelMatch?: ModelMatch;

  repositoryMode?: boolean;
}
