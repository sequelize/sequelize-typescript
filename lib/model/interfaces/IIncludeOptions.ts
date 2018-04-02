import {Model} from "../models/Model";
import {IIncludeAssociation} from "./IIncludeAssociation";
import {IBaseIncludeOptions} from "./IBaseIncludeOptions";

/**
 * Based on "IncludeOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3198
 */

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

  /**
   * If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will
   * be returned. Only applies if `options.paranoid` is true for the model.
   */
  paranoid?: boolean;

}
