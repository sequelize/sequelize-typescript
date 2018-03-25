import {IFindOptions} from "./IFindOptions";

export interface IFindOrInitializeOptions<TAttributes> extends IFindOptions<TAttributes> {

  /**
   * Default values to use if building a new instance
   */
  defaults?: TAttributes;
}
