import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

/**
 * Checks for IPv6 format
 */
export function IsIPv6(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isIPv6: true
    }
  });
}
