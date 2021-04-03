import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Only allow date strings after a specific date
 */
export function IsAfter(date: string): Function {
  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        isAfter: date,
      },
    });
}
