import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

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
