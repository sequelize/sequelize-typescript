import {LoggingOptions, SearchPathOptions} from 'sequelize';
import {IIncludeOptions} from './IIncludeOptions';
import {Model} from '../models/Model';
import {IWhereOptions} from "./IWhereOptions";

export interface ICountOptions<T> extends LoggingOptions, SearchPathOptions {

  /**
   * A hash of search attributes.
   */
  where?: IWhereOptions<T> | string[];

  /**
   * Include options. See `find` for details
   */
  include?: Array<typeof Model | IIncludeOptions>;

  /**
   * Apply column on which COUNT() should be applied
   */
  col?: string;

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

  /**
   * If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will
   * be returned. Only applies if `options.paranoid` is true for the model.
   */
  paranoid?: boolean;
}
