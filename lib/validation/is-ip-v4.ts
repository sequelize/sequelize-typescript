import 'reflect-metadata';
import {addAttributeOptions} from "../model/column/attribute-service";

/**
 * Checks for IPv4 (129.89.23.1)
 */
export function IsIPv4(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isIPv4: true
    }
  });
}
