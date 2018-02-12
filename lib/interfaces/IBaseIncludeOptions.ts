import {WhereOptions, IncludeThroughOptions, FindOptionsAttributesArray} from 'sequelize';

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
  where?: WhereOptions<any>;

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
}
