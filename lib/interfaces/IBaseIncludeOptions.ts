import {WhereOptions, IncludeThroughOptions, FindOptionsAttributesArray, where} from 'sequelize';

/**
 * Complex include options
 */
export interface IBaseIncludeOptions {

  /**
   * The alias of the relation, in case the model you want to eagerly load is aliassed. For `hasOne` /
   * `belongsTo`, this should be the singular name, and for `hasMany`, it should be the plural
   */
  as?: string;

  /**
   * Where clauses to apply to the child models. Note that this converts the eager load to an inner join,
   * unless you explicitly set `required: false`
   */
  where?: WhereOptions<any> | where;

  /**
   * A list of attributes to select from the child model
   */
  attributes?: FindOptionsAttributesArray | { include?: FindOptionsAttributesArray, exclude?: string[] };

  /**
   * If true, converts to an inner join, which means that the parent model will only be loaded if it has any
   * matching children. True if `include.where` is set, false otherwise.
   */
  required?: boolean;

  /**
   * Through Options
   */
  through?: IncludeThroughOptions;

  all?: boolean | string;

  /**
   * Enables ON clauses as per https://github.com/sequelize/sequelize/issues/5551#issuecomment-193890421
   * @example
   * on: {
   *   '$table1.itemId$': {$col: 'table2.itemId'},
   *   '$table1.typeId$': {$col: 'table2.typeId'}
   * }
   */
  on: any;
}
