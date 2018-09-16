import {
  WhereOptions, LoggingOptions, SearchPathOptions, col,
  literal, fn, and, or, where
} from 'sequelize';
import {Model} from "../models/Model";
import {IIncludeOptions} from "./IIncludeOptions";
import {IFindOptionsAttributesArray} from '../../shared/IFindOptionsAttributesArray';

/**
 * Based on "FindOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3262
 */

/* tslint:disable:array-type */
/* tslint:disable:max-line-length */

export interface IFindOptions<T> extends LoggingOptions, SearchPathOptions {

  /**
   * A hash of attributes to describe your search. See above for examples.
   */
  where?: WhereOptions<T> | where | fn | literal | or | Array<col | literal | and | or | string>;

  /**
   * A list of the attributes that you want to select. To rename an attribute, you can pass an array, with
   * two elements - the first is the name of the attribute in the DB (or some kind of expression such as
   * `Sequelize.literal`, `Sequelize.fn` and so on), and the second is the name you want the attribute to
   * have in the returned instance
   */
  attributes?: IFindOptionsAttributesArray<keyof T> | { include?: IFindOptionsAttributesArray<keyof T>, exclude?: Array<keyof T> };

  /**
   * If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will
   * be returned. Only applies if `options.paranoid` is true for the model.
   */
  paranoid?: boolean;

  /**
   * A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}` or `{ include: [{ model: Model1, as: 'Alias' }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   */
  include?: Array<typeof Model | IIncludeOptions>;

  /**
   * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   */
  order?: string | col | fn | literal | Array<string | number | typeof Model | { model: typeof Model, as?: string }> |
    Array<string | col | fn | literal | Array<string | number | typeof Model | { model: typeof Model, as?: string }>>;

  /**
   * Limit the results
   */
  limit?: number;

  /**
   * Skip the results;
   */
  offset?: number;

  /**
   * Lock the selected rows. A true boolean value will lock the request with a 'FOR UPDATE' lock. Possible 
   * additional options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE. Postgres also supports
   * transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model locks with joins.
   * See [transaction.LOCK for an example](transaction#lock)
   * 
   * See [sequelize docs](https://github.com/sequelize/sequelize/blob/master/docs/transactions.md#after-commit-hook) for an
   * example of boolean usage.
   */
  lock?: boolean | string | { level: string, of: typeof Model };

  /**
   * Return raw result. See sequelize.query for more information.
   */
  raw?: boolean;

  /**
   * having ?!?
   */
  having?: WhereOptions<any>;

  /**
   * Group by. It is not mentioned in sequelize's JSDoc, but mentioned in docs.
   * https://github.com/sequelize/sequelize/blob/master/docs/docs/models-usage.md#user-content-manipulating-the-dataset-with-limit-offset-order-and-group
   */
  group?: string | string[] | Object;

  /**
   * Apply DISTINCT(col) for FindAndCount(all)
   */
  distinct?: boolean;

  /**
   * Prevents a subquery on the main table when using include
   */
  subQuery?: boolean;

  /**
   * Throw EmptyResultError if a record is not found
   */
  rejectOnEmpty?: boolean | Error;
}
