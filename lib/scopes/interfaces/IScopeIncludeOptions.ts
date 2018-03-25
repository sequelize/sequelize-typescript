import {IScopeIncludeAssociation} from "./IScopeIncludeAssociation";
import {ModelClassGetter} from "../../model/types/ModelClassGetter";
import {IBaseIncludeOptions} from "../../model/interfaces/IBaseIncludeOptions";

/**
 * Complex include options
 */
export interface IScopeIncludeOptions extends IBaseIncludeOptions {

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
