import {DataTypeAbstract, ModelOptions} from 'sequelize';

import {Model} from '../model/model';
import {inferDataType} from "../../sequelize/data-type/data-type-service";

const MODEL_NAME_KEY = 'sequelize:modelName';
const OPTIONS_KEY = 'sequelize:options';

/**
 * Sets model name from class by storing this
 * information through reflect metadata
 */
export function setModelName(target: any, modelName: string): void {
  Reflect.defineMetadata(MODEL_NAME_KEY, modelName, target);
}

/**
 * Returns model name from class by restoring this
 * information from reflect metadata
 */
export function getModelName(target: any): string {
  return Reflect.getMetadata(MODEL_NAME_KEY, target);
}

/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
export function getOptions(target: any): ModelOptions | undefined {
  const options = Reflect.getMetadata(OPTIONS_KEY, target);

  if (options) {
    return {...options};
  }
}

/**
 * Sets seuqlize define options to class prototype
 */
export function setOptions(target: any, options: ModelOptions<any>): void {
  Reflect.defineMetadata(OPTIONS_KEY, {...options}, target);
}

/**
 * Adds options be assigning new options to old one
 */
export function addOptions(target: any, options: ModelOptions<any>): void {
  let _options = getOptions(target);

  if (!_options) {
    _options = {};
  }
  setOptions(target, {..._options, ...options, validate: {
    ...(_options.validate || {}),
    ...(options.validate || {}),
  }});
}

/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
export function getSequelizeTypeByDesignType(target: any, propertyName: string): DataTypeAbstract {
  const type = Reflect.getMetadata('design:type', target, propertyName);
  const dataType = inferDataType(type);

  if (dataType) {
    return dataType;
  }

  throw new Error(`Specified type of property '${propertyName}'
            cannot be automatically resolved to a sequelize data type. Please
            define the data type manually`);
}

/**
 * Resolves all model getters of specified options object
 * recursively.
 * So that {model: () => Person} will be converted to
 * {model: Person}
 */
export function resolveModelGetter(options: any) {
  const maybeModelGetter = value => typeof value === 'function' && value.length === 0;
  const isModel = value => value && value.prototype && value.prototype instanceof Model;
  const isOptionObjectOrArray = value => value && typeof value === 'object';

  return Object
    .keys(options)
    .reduce((acc, key) => {
      const value = options[key];

      if (maybeModelGetter(value)) {
        const maybeModel = value();

        if (isModel(maybeModel)) {
          acc[key] = maybeModel;
        }
      } else if (isOptionObjectOrArray(value)) {
        acc[key] = resolveModelGetter(value);
      }

      return acc;
    }, Array.isArray(options) ? [...options] : {...options});
}

