import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

/**
 * Check for valid credit card numbers
 */
export function IsCreditCard(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isCreditCard: true
    }
  });
}
