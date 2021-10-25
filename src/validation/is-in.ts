import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Check the value is one of these
 */
export function IsIn(arg: any[][] | { msg: string; args: any[][] }): Function {
  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        isIn: arg,
      },
    });
}
