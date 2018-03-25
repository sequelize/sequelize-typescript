import {RetryOptions, ReturningOptions, SearchPathOptions} from 'sequelize';
import {Model} from '../../model/models/Model';

/**
 * Based on "QueryOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sequelize/index.d.ts
 */

export interface IQueryOptions extends SearchPathOptions, ReturningOptions {

  /**
   * If true, sequelize will not try to format the results of the query, or build an instance of a model from
   * the result
   */
  raw?: boolean;


  /**
   * The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   */
  type?: string;

  /**
   * If true, transforms objects with `.` separated property names into nested objects using
   * [dottie.js](https://github.com/mickhansen/dottie.js). For example { 'user.username': 'john' } becomes
   * { user: { username: 'john' }}. When `nest` is true, the query type is assumed to be `'SELECT'`,
   * unless otherwise specified
   *
   * Defaults to false
   */
  nest?: boolean;

  /**
   * Sets the query type to `SELECT` and return a single row
   */
  plain?: boolean;

  /**
   * Either an object of named parameter replacements in the format `:param` or an array of unnamed
   * replacements to replace `?` in your SQL.
   */
  replacements?: Object | string[];

  /**
   * Either an object of named bind parameter in the format `$param` or an array of unnamed
   * bind parameter to replace `$1`, `$2`, ... in your SQL.
   */
  bind?: Object | string[];

  /**
   * Force the query to use the write pool, regardless of the query type.
   *
   * Defaults to false
   */
  useMaster?: boolean;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * A sequelize instance used to build the return instance
   */
  instance?: Model<any>;

  /**
   * A sequelize model used to build the returned model instances (used to be called callee)
   */
  model?: typeof Model;

  /**
   * Set of flags that control when a query is automatically retried.
   */
  retry?: RetryOptions;

  /**
   * If false do not prepend the query with the search_path (Postgres only)
   */
  supportsSearchPath?: boolean;

  /**
   * Map returned fields to model's fields if `options.model` or `options.instance` is present.
   * Mapping will occur before building the model instance.
   */
  mapToModel?: boolean;

  // TODO: force, cascade
  fieldMap?: { [key: string]: string; };
}
