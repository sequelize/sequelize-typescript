import {addAttributeOptions} from "../model/column/attribute-service";

/**
 * Only allows null
 */
export function IsNull(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isNull: true
    }
  });
}
