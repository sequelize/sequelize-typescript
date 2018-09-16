import 'reflect-metadata';
import {addAttributeOptions} from "../../model/column/attribute-service";

/**
 * Only allow date strings before a specific date
 */
export function IsBefore(date: string): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        isBefore: date
      }
    });
}
