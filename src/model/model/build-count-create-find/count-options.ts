import {LoggingOptions, SearchPathOptions} from 'sequelize';
import {IncludeOptions} from '../include/include-options';
import {Model} from '../model';
import {WhereOptions} from "./where-options";

/**
 * Based on "CountOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3353
 */

export interface CountOptions<T> extends LoggingOptions, SearchPathOptions {

  /**
   * A hash of search attributes.
   */
  where?: WhereOptions<T> | string[];

  /**
   * Include options. See `find` for details
   */
  include?: Array<typeof Model | IncludeOptions>;

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
