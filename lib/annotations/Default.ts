import 'reflect-metadata';
import {SequelizeModelService} from "../services/SequelizeModelService";

/**
 * Sets the specified default value for the annotated field
 */
export function Default(value: any): Function {

  return (target: any, propertyName: string) => {

    const options = SequelizeModelService.getAttributeOptions(target.constructor, propertyName);

    options.defaultValue = value;
  };
}
