import {ReturningOptions} from 'sequelize';
import {IIncludeOptions} from "./IIncludeOptions";
import {Model} from "../models/Model";

/**
 * Based on "BuildOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3391
 */

export interface IBuildOptions extends ReturningOptions {

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
  include?: Array<typeof Model | IIncludeOptions>;
}
