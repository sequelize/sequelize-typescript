import {InstanceSaveOptions} from 'sequelize';
import {IBuildOptions} from "./IBuildOptions";
import {Model} from "../models/Model";

/**
 * Options for Model.create method
 */
export interface ICreateOptions<T extends Model<T> = Model<any>> extends IBuildOptions<T>, InstanceSaveOptions {

  /**
   * On Duplicate
   */
  onDuplicate?: string;
}
