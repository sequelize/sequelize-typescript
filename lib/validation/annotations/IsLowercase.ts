import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

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
