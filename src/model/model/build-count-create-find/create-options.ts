import {InstanceSaveOptions} from 'sequelize';
import {BuildOptions} from "./build-options";

/**
 * Based on "CreateOptions" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6490e738919a47761850caaeb14517b8af60d2a1/types/sequelize/index.d.ts#L3353
 */

/**
 * Options for Model.create method
 */
export interface CreateOptions extends BuildOptions, InstanceSaveOptions {

  /**
   * On Duplicate
   */
  onDuplicate?: string;
}
