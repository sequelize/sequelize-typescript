import 'reflect-metadata';
import {addAttributeOptions} from "../model/column/attribute-service";

/**
 * Checks for valid floating point numbers
 */
export function IsFloat(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isFloat: true
    }
  });
}
