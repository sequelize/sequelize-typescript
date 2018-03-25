import 'reflect-metadata';
import {DefineValidateOptions} from 'sequelize';
import {addAttributeOptions} from "../../model/models";

/**
 * Adds custom validator
 * @param name Name of validator
 * @param validator Validator function
 */
export function Is(name: string, validator: (value: any) => any): Function;
/**
 * Adds custom validator
 * @param validator Validator function
 */
export function Is(validator: (value: any) => any): Function;
/**
 * Will only allow values, that match the string regex or real regex
 */
export function Is(arg: string | Array<string | RegExp> | RegExp | {msg: string, args: string | Array<string | RegExp> | RegExp}): Function;
export function Is(...args: any[]): Function {

  const options: DefineValidateOptions = {};
  const argIsFunction = typeof args[0] === 'function';

  if (argIsFunction || (typeof args[0] === 'string' && typeof args[1] === 'function')) {
    let validator: (value: any) => any;
    let name: string;

    if (argIsFunction) {

      validator = (args[0] as (value: any) => any);
      name = validator.name;

      if (!name) throw new Error(`Passed validator function must have a name`);
    } else {

      name = args[0];
      validator = args[1];
    }

    options[`is${name.charAt(0).toUpperCase() + name.substr(1, name.length)}`] = validator;
  } else {
    options.is = args[0];
  }

  return (target: any, propertyName: string) =>
    addAttributeOptions(target, propertyName, {
      validate: options
    });
}
