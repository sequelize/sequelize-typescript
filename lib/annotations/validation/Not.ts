import 'reflect-metadata';
import {DefineValidateOptions} from 'sequelize';
import {addAttributeOptions} from "../../services/models";

/**
 * Only allow values <= limit
 */
export function Is(name: string, validator: (value: any) => any): Function;
export function Is(arg: string | Array<string | RegExp> | RegExp | {msg: string, args: string | Array<string | RegExp> | RegExp}): Function;
export function Is(...args: any[]): Function {

  const options: DefineValidateOptions = {};

  if (typeof args[0] === 'string' && typeof args[1] === 'function') {
    const name: string = args[0];
    const validator: (value: any) => any = args[1];

    options[`is${name.charAt(0).toUpperCase() + name.substr(1, name.length)}`] = validator;
  } else {
    options.is = args[0];
  }

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: options
    });
}
