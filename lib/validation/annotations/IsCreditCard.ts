import 'reflect-metadata';
import {addAttributeOptions} from "../../model/column/attribute-service";

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
