import 'reflect-metadata';
import {addAttributeOptions} from "../../model/column/attribute-service";

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
