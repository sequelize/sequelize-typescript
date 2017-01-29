import 'reflect-metadata';
import * as modelUtil from "../utils/models";
import {FindOptions} from "sequelize";

/**
 * Sets default scope for annotated class
 */
export function DefaultScope(scope: FindOptions | Function): Function {

  return (target: any) => {

    const options = modelUtil.getOptions(target);

    options.defaultScope = scope;
  };
}
