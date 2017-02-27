import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Checks for valid integers
 */
export function IsInt(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isInt: true
    }
  });
}
