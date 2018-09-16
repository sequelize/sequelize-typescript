import 'reflect-metadata';
import {addAttributeOptions} from "../../model/column/attribute-service";

/**
 * Checks for email format (foo@bar.com)
 */
export function IsEmail(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isEmail: true
    }
  });
}
