import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Force specific substrings
 */
export function Contains(value: string | { msg: string; args: string }): Function {
  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        contains: value,
      },
    });
}
