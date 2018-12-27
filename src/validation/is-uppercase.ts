import 'reflect-metadata';
import {addAttributeOptions} from "../model/column/attribute-service";

/**
 * Checks for uppercase
 */
export function IsUppercase(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isUppercase: true
    }
  });
}
