import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Will only allow arrays
 */
export function IsArray(target: any, propertyName: string): void {
  addAttributeOptions(target, propertyName, {
    validate: {
      isArray: true,
    },
  });
}
