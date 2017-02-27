import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Force specific substrings
 */
export function Contains(value: string | {msg: string, args: string}): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        contains: value
      }
    });
}

