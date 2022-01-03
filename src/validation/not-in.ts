import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Check the value is not one of these
 */
export function NotIn(arg: any[][] | { msg: string; args: any[][] }): Function {
  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        notIn: arg,
      },
    });
}
