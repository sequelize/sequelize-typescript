import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

/**
 * Will only allow arrays
 */
export function IsArray(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isArray: true
    }
  });
}
