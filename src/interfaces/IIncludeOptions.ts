import {Model} from "../models/Model";
import {IncludeAssociation} from "sequelize";
import {WhereOptions} from "sequelize";
import {IncludeThroughOptions} from "sequelize";

export interface IIncludeOptions {

  /**
   * The model you want to eagerly load
   */
  model?: typeof Model;

  /**
   * The alias of the relation, in case the model you want to eagerly load is aliassed. For `hasOne` /
   * `belongsTo`, this should be the singular name, and for `hasMany`, it should be the plural
   */
    as?: string;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: IncludeAssociation;

  /**
   * Where clauses to apply to the child models. Note that this converts the eager load to an inner join,
   * unless you explicitly set `required: false`
   */
  where?: WhereOptions;

  /**
   * A list of attributes to select from the child model
   */
  attributes?: string[];

  /**
   * If true, converts to an inner join, which means that the parent model will only be loaded if it has any
   * matching children. True if `include.where` is set, false otherwise.
   */
  required?: boolean;

  /**
   * Through Options
   */
  through?: IncludeThroughOptions;

  /**
   * Load further nested related models
   */
  include?: Array<typeof Model | IIncludeOptions>;


}
