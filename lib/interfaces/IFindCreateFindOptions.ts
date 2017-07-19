import {IFindOptions} from "./IFindOptions";

export interface IFindCreateFindOptions<TAttributes> extends IFindOptions {

  /**
   * Default values to use if building a new instance
   */
  defaults?: TAttributes;

}
