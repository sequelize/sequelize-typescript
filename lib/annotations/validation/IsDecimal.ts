import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Checks for any numbers
 */
export function IsDecimal(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isDecimal: true
    }
  });
}
