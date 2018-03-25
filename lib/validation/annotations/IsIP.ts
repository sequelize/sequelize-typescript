import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

/**
 * Checks for IPv4 (129.89.23.1) or IPv6 format
 */
export function IsIP(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isIP: true
    }
  });
}
