import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Will only allow alphanumeric characters, so "_abc" will fail
 */
export function IsAlphanumeric(target: any, propertyName: string): void {
  addAttributeOptions(target, propertyName, {
    validate: {
      isAlphanumeric: true,
    },
  });
}
