import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

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
