import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Will only allow alphanumeric characters, so "_abc" will fail
 */
export function IsAlphanumeric(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isAlphanumeric: true
    }
  });
}
