import 'reflect-metadata';
import * as glob from 'glob';
import * as path from 'path';
import {DataTypeAbstract, DefineOptions} from 'sequelize';
import {IPartialDefineAttributeColumnOptions} from './interfaces/IPartialDefineAttributeColumnOptions';
import {deepAssign} from '../common/utils/object';
import {inferDataType} from '../sequelize/data-type';
import {uniqueFilter} from '../common/utils/array';
import {Model} from './models/Model';
import {ModelMatch} from '../sequelize/types/SequelizeOptions';

const MODEL_NAME_KEY = 'sequelize:modelName';
const ATTRIBUTES_KEY = 'sequelize:attributes';
const OPTIONS_KEY = 'sequelize:options';
export const DEFAULT_DEFINE_OPTIONS: DefineOptions<any> = {
  timestamps: false,
  freezeTableName: true
};

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
 * Returns model attributes from class by restoring this
 * information from reflect metadata
 */
export function getAttributes(target: any): any | undefined {
  const attributes = Reflect.getMetadata(ATTRIBUTES_KEY, target);

  if (attributes) {

    return Object
      .keys(attributes)
      .reduce((copy, key) => {
        copy[key] = {...attributes[key]};

        return copy;
      }, {});
  }
}

/**
 * Sets attributes
 */
export function setAttributes(target: any, attributes: any): void {
  Reflect.defineMetadata(ATTRIBUTES_KEY, {...attributes}, target);
}

/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export function addAttribute(target: any,
                             name: string,
                             options: any): void {
  let attributes = getAttributes(target);

  if (!attributes) {
    attributes = {};
  }
  attributes[name] = {...options};

  setAttributes(target, attributes);
}

/**
 * Adds attribute options for specific attribute
 */
export function addAttributeOptions(target: any,
                                    propertyName: string,
                                    options: IPartialDefineAttributeColumnOptions): void {
  const attributes = getAttributes(target);

  if (!attributes || !attributes[propertyName]) {
    throw new Error(`@Column annotation is missing for "${propertyName}" of class "${target.constructor.name}"` +
      ` or annotation order is wrong.`);
  }

  attributes[propertyName] = deepAssign(attributes[propertyName], options);

  setAttributes(target, attributes);
}

/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
export function getOptions(target: any): DefineOptions<any> | undefined {
  const options = Reflect.getMetadata(OPTIONS_KEY, target);

  if (options) {
    return {...options};
  }
}

/**
 * Sets seuqlize define options to class prototype
 */
export function setOptions(target: any, options: DefineOptions<any>): void {
  Reflect.defineMetadata(OPTIONS_KEY, {...options}, target);
}

/**
 * Adds options be assigning new options to old one
 */
export function addOptions(target: any, options: DefineOptions<any>): void {
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
 * Determines models from value
 */
export function getModels(
  arg: Array<typeof Model | string>,
  modelMatch: ModelMatch,
): Array<typeof Model> {

  if (arg && typeof arg[0] === 'string') {

    return arg.reduce((models: any[], dir) => {

      if (!glob.hasMagic(dir)) dir = path.join(dir, '/*');
      const _models = glob
        .sync(dir as string)
        .filter(isImportable)
        .map(getFullfilepathWithoutExtension)
        .filter(uniqueFilter)
        .map(fullPath => {

          const module = require(fullPath);
          const fileName = path.basename(fullPath);

          const matchedMemberKey = Object.keys(module).find(m => modelMatch(fileName, m));
          const matchedMember = matchedMemberKey ? module[matchedMemberKey] : undefined;

          if (!matchedMember && !module.default) {
            throw new Error(`No default export defined for file "${fileName}" or ` +
              `export does not satisfy filename.`);
          }
          return matchedMember || module.default;
        });

      models.push(..._models);

      return models;
    }, [])
      ;
  }

  return arg as Array<typeof Model>;
}

/**
 * Resolves all model getters of specified options object
 * recursively.
 * So that {model: () => Person} will be converted to
 * {model: Person}
 */
export function resolveModelGetter(options: any): void {
  const maybeModelGetter = value => typeof value === 'function' && value.length === 0;
  const isModel = value => value && value.prototype && value.prototype instanceof Model;
  const isOptionObject = value => value && typeof value === 'object';

  Object
    .keys(options)
    .forEach(key => {
      const value = options[key];

      if (maybeModelGetter(value)) {
        const maybeModel = value();

        if (isModel(maybeModel)) {
          options[key] = maybeModel;
        }
      } else if (isOptionObject(value)) {
        resolveModelGetter(value);
      }
    });
}

/**
 * Checks if specified filename is importable or not;
 * Which means that, it needs to have a specific file extension
 */
function isImportable(file: string): boolean {
  const filePart = file.slice(-3);
  return filePart === '.js' || (filePart === '.ts' && file.slice(-5) !== '.d.ts');
}

/**
 * Return the value of the full path with filename, without extension
 */
function getFullfilepathWithoutExtension(file: string): string {
  const parsedFile = path.parse(file);
  return path.join(parsedFile.dir, parsedFile.name);
}
