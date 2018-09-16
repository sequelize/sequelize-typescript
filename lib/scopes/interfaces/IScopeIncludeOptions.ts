import {IScopeIncludeAssociation} from "./IScopeIncludeAssociation";
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {BaseIncludeOptions} from "../../model/model/include/base-include-options";

/**
 * Based on "IncludeOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3198
 */

/**
 * Complex include options
 */
export interface IScopeIncludeOptions extends BaseIncludeOptions {

  /**
   * The model you want to eagerly load
   */
  model?: ModelClassGetter;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: IScopeIncludeAssociation;

  /**
   * Load further nested related models
   */
  include?: Array<ModelClassGetter | IScopeIncludeOptions>;

}
