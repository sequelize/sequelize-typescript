import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Check the value is one of these
 */
export function IsIn(arg: string[][] | { msg: string, args: string[][] }): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        isIn: arg
      }
    });
}
