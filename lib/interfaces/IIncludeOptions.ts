import {Model} from "../models/Model";
import {IIncludeAssociation} from "./IIncludeAssociation";
import {IBaseIncludeOptions} from "./IBaseIncludeOptions";
import { IFindOptions } from "./IFindOptions";
import { IWhereOptions } from "./IWhereOptions";
import { where } from "sequelize";


/**
 * Complex include options
 */
export interface IIncludeOptions extends IBaseIncludeOptions {

  /**
   * The model you want to eagerly load
   */
  model?: typeof Model;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: IIncludeAssociation | string;

  /**
   * Load further nested related models
   */
  include?: Array<typeof Model | IIncludeOptions| IIncludeOptionsSeparate>;

  /**
   * If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will
   * be returned. Only applies if `options.paranoid` is true for the model.
   */
  paranoid?: boolean;
  
  /**
  * If true, runs a separate query to fetch the associated instances, only supported for hasMany associations
  */
  separate?: boolean;                  
}

/**
 * Complex include options for executing seperate queries.
 */
export interface IIncludeOptionsSeparate extends IIncludeOptions, IFindOptions<any> {
  
  /**
  * If true, runs a separate query to fetch the associated instances, only supported for hasMany associations
  */
  separate: true;

  where?: IWhereOptions<any> | where;
  
  include?: Array<typeof Model | IIncludeOptions | IIncludeOptionsSeparate>;
}
