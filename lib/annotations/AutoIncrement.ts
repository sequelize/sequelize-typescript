import 'reflect-metadata';
import {addAttributeOptions} from "../services/models";

/**
 * Sets auto increment true for annotated field
 */
export function AutoIncrement(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    autoIncrement: true
  });
}
