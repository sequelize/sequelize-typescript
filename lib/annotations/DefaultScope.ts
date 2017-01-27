import 'reflect-metadata';
import {SequelizeModelService} from "../services/SequelizeModelService";
import {FindOptions} from "sequelize";

/**
 * Sets default scope for annotated class
 */
export function DefaultScope(scope: FindOptions | Function): Function {

  return (target: any) => {

    const options = SequelizeModelService.getOptions(target);

    options.defaultScope = scope;
  };
}
