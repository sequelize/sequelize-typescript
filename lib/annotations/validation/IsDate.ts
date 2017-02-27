import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Only allow date strings
 */
export function IsDate(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isDate: true
    }
  });
}
