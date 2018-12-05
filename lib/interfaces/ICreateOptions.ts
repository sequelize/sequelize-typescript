import {InstanceSaveOptions} from 'sequelize';
import {IBuildOptions} from "./IBuildOptions";

/**
 * Options for Model.create method
 */
export interface ICreateOptions extends IBuildOptions, InstanceSaveOptions {

  /**
   * On Duplicate
   */
  onDuplicate?: string;

  /**
   * Enable or disable hooks being triggered from this call
   * @default true
   */
  hooks?: boolean;

}
