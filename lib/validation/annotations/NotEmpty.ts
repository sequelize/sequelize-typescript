import 'reflect-metadata';
import {addAttributeOptions} from "../../model/models";

/**
 * Don't allow empty strings
 */
export function NotEmpty(target: any, propertyName: string): void;
export function NotEmpty(options: {msg: string}): Function;
export function NotEmpty(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addAttributeOptions(target, propertyName, {
        validate: {
          notEmpty: options,
        }
      });
  } else {

    const target = args[0];
    const propertyName = args[1];

    addAttributeOptions(target, propertyName, {
      validate: {
        notEmpty: true
      }
    });
  }
}
