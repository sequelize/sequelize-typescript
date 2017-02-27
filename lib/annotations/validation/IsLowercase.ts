import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

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
