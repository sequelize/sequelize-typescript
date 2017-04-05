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
}
