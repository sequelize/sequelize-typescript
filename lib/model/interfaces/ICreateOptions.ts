import {InstanceSaveOptions} from 'sequelize';
import {IBuildOptions} from "./IBuildOptions";

/**
 * Based on "CreateOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3353
 */

/**
 * Options for Model.create method
 */
export interface ICreateOptions extends IBuildOptions, InstanceSaveOptions {

  /**
   * On Duplicate
   */
  onDuplicate?: string;
}
