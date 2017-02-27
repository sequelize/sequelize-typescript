import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Don't allow empty strings
 */
export function NotEmpty(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      notEmpty: true
    }
  });
}
