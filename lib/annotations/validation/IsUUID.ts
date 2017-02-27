import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Only allow uuids
 */
export function IsUUID(version: number): Function {

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: {
        isUUID: version
      }
    });
}
