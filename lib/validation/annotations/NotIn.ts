import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

/**
 * Check the value is not one of these
 */
export function NotIn(arg: string[][] | { msg: string, args: string[][] }): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        notIn: arg
      }
    });
}
