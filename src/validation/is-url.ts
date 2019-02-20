import {addAttributeOptions} from "../model/column/attribute-service";

/**
 * Checks for url format (http://foo.com)
 */
export function IsUrl(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isUrl: true
    }
  });
}
