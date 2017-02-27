import 'reflect-metadata';
import {addAttributeOptions} from "../../services/models";

/**
 * Will only allow letters
 */
export function IsAlpha(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    validate: {
      isAlpha: true
    }
  });
}
