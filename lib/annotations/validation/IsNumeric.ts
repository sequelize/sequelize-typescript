import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Will only allow numbers
 */
export function IsNumeric(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isNumeric: true
    }
  });
}
