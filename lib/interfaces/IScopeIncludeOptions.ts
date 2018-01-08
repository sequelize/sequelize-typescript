import {IScopeIncludeAssociation} from "./IScopeIncludeAssociation";
import {ModelClassGetter} from "../types/ModelClassGetter";
import {IBaseIncludeOptions} from "./IBaseIncludeOptions";

/**
 * Complex include options
 */
export interface IScopeIncludeOptions<T = any> extends IBaseIncludeOptions<T> {

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
  include?: Array<ModelClassGetter | IScopeIncludeOptions<T>>;

}
