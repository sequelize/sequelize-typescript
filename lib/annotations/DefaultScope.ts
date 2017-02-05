import 'reflect-metadata';
import {FindOptions} from "sequelize";
import {addOptions} from "../utils/models";

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
