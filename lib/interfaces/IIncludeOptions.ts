import {Model} from "../models/Model";
import {IIncludeAssociation} from "./IIncludeAssociation";
import {IBaseIncludeOptions} from "./IBaseIncludeOptions";

/**
 * Complex include options
 */
export interface IIncludeOptions extends IBaseIncludeOptions {

  /**
   * The model you want to eagerly load
   */
  model?: typeof Model;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: IIncludeAssociation;

  /**
   * Load further nested related models
   */
  include?: Array<typeof Model | IIncludeOptions>;

}
