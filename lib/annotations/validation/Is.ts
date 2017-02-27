import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Only allow values <= limit
 */
export function Max(limit: number): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        max: limit
      }
    });
}
