import { addAttributeOptions } from '../model/column/attribute-service';

/**
 * Only allow values <= limit
 */
export function Max(limit: number): Function {
  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        max: limit,
      },
    });
}
