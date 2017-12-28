import {LoggingOptions, SearchPathOptions, WhereOptions} from 'sequelize';
import {IIncludeOptions} from './IIncludeOptions';
import {Model} from '../models/Model';

export interface ICountOptions<T> extends LoggingOptions, SearchPathOptions {

  /**
   * A hash of search attributes.
   */
  where?: WhereOptions<T> | string[];

  /**
   * Include options. See `find` for details
   */
  include?: Array<typeof Model | IIncludeOptions>;

  /**
   * Apply COUNT(DISTINCT(col))
   */
  distinct?: boolean;

  /**
   * Used in conjustion with `group`
   */
  attributes?: Array<string | [string, string]>;

  /**
   * For creating complex counts. Will return multiple rows as needed.
   *
   * TODO: Check?
   */
  group?: Object;
}
