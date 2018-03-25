import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

/**
 * Only allow values >= limit
 */
export function Min(limit: number): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        min: limit
      }
    });
}
