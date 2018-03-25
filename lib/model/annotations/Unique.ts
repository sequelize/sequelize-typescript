import 'reflect-metadata';
import {addAttributeOptions} from "../models";

/**
 * Sets unique option true for annotated property.
 */
export function Unique(target: any, propertyName: string): void {

  addAttributeOptions(target, propertyName, {
    unique: true
  });
}
