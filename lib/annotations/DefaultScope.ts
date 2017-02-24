import 'reflect-metadata';
import {FindOptions} from "sequelize";
import {addOptions} from "../services/models";

/**
 * Sets default scope for annotated class
 */
export function DefaultScope(scope: FindOptions | Function): Function {

  return (target: any) => {

    addOptions(target.prototype, {
      defaultScope: scope
    });
  };
}
