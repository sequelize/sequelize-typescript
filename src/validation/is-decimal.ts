import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Checks for any numbers
 */
export function IsDecimal(target: any, propertyName: string): void {
  addAttributeOptions(target, propertyName, {
    validate: {
      isDecimal: true,
    },
  });
}
