import {Model} from "../model";
import {IncludeAssociationOptions} from "./include-association-options";
import {BaseIncludeOptions} from "./base-include-options";

/**
 * Based on "IncludeOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3198
 */

/**
 * Complex include options
 */
export interface IncludeOptions extends BaseIncludeOptions {

  /**
   * The model you want to eagerly load
   */
  model?: typeof Model;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: IncludeAssociationOptions;

  /**
   * Load further nested related models
   */
  include?: Array<typeof Model | IncludeOptions>;

  /**
   * If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will
   * be returned. Only applies if `options.paranoid` is true for the model.
   */
  paranoid?: boolean;

}
