import {FindOptions} from "./find-options";

/**
 * Based on "FindCreateFindOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3437
 */

export interface FindCreateFindOptions<TAttributes> extends FindOptions<TAttributes> {

  /**
   * Default values to use if building a new instance
   */
  defaults?: Partial<TAttributes>;

}
