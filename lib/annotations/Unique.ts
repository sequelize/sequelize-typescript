import 'reflect-metadata';
import {addAttributeOptions} from "../services/models";

export type uniqueAnnotation = (target: any, propertyName: string) => void;

/**
 * Sets unique option for annotated property.
 */
export function Unique(keyCombinator: string): uniqueAnnotation;
export function Unique(target: any, propertyName: string): void;
export function Unique(targetOrCombinator: string | any, propertyName?: string): void | uniqueAnnotation  {
  if (typeof targetOrCombinator === 'string') {
    return (target: any, innerPropertyName: string) => {
      addAttributeOptions(target, innerPropertyName, {
        unique: targetOrCombinator
      });
    };
  }

  if (propertyName === undefined) {
    throw Error('Property name needs to be defined');
  }

  addAttributeOptions(targetOrCombinator, propertyName, {
    unique: true
  });
}
