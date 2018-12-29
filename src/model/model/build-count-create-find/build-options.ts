import {ReturningOptions} from 'sequelize';
import {IncludeOptions} from "../include/include-options";
import {ModelType} from "../model-type";

/**
 * Based on "BuildOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3391
 */

export interface BuildOptions extends ReturningOptions {

  /**
   * If set to true, values will ignore field and virtual setters.
   */
  raw?: boolean;

  /**
   * Is this record new
   */
  isNewRecord?: boolean;

  /**
   * an array of include options - Used to build prefetched/included model instances. See `set`
   */
  include?: Array<ModelType<any> | IncludeOptions>;
}
