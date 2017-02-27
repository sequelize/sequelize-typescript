import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

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
