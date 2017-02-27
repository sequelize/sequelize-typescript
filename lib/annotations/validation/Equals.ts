import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Only allow a specific value
 */
export function Equals(value: string | {msg: string, args: string}): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        equals: value
      }
    });
}
