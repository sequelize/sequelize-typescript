import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Don't allow specific substrings
 */
export function NotContains(value: string | {msg: string, args: string}): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        notContains: value
      }
    });
}
