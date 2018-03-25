import {ReturningOptions} from 'sequelize';
import {IIncludeOptions} from "./IIncludeOptions";
import {Model} from "../models/Model";

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
