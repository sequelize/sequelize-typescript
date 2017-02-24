import 'reflect-metadata';
import {DefineValidateOptions} from 'sequelize';
import {addAttributeOptions} from "../../services/models";

/**
 * Sets validation options for annotated field
 */
export function Validate(options: DefineValidateOptions): Function {

  options = Object.assign({}, options);

  return (target: any, propertyName: string) => {

    addAttributeOptions(target, propertyName, {
      validate: options
    });

  };
}
