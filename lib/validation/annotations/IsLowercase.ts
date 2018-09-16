import 'reflect-metadata';
import {addAttributeOptions} from "../../model/column/attribute-service";

/**
 * Checks for lowercase
 */
export function IsLowercase(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isLowercase: true
    }
  });
}
