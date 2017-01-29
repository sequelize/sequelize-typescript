import 'reflect-metadata';
import * as modelUtil from "../utils/models";

/**
 * Sets the specified default value for the annotated field
 */
export function Default(value: any): Function {

  return (target: any, propertyName: string) => {

    const options = modelUtil.getAttributeOptions(target, propertyName);

    options.defaultValue = value;
  };
}
