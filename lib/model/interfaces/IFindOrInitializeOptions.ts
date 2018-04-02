import {IFindOptions} from "./IFindOptions";

/**
 * Based on "FindOrInitializeOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3425
 */

export interface IFindOrInitializeOptions<TAttributes> extends IFindOptions<TAttributes> {

  /**
   * Default values to use if building a new instance
   */
  defaults?: TAttributes;
}
