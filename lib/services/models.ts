import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import {DataTypeAbstract, DefineOptions} from 'sequelize';
import {Model} from "../models/Model";
import {IPartialDefineAttributeColumnOptions} from "../interfaces/IPartialDefineAttributeColumnOptions";
import {inferDataType} from "../utils/data-type";
import {deepAssign} from "../utils/object";
import {getAssociationsByRelation} from "./association";
import {uniqueFilter} from "../utils/array";

const MODEL_NAME_KEY = 'sequelize:modelName';
const ATTRIBUTES_KEY = 'sequelize:attributes';
const OPTIONS_KEY = 'sequelize:options';
export const DEFAULT_DEFINE_OPTIONS: DefineOptions<any> = {
  timestamps: false
};
export const PROPERTY_LINK_TO_ORIG = '__origClass';

/**
 * Indicates which static methods of Model has to be proxied,
 * to prepare include option to automatically resolve alias;
 * The index represents the index of the options of the
 * corresponding method parameter
 */
export const INFER_ALIAS_MAP = {
  bulkBuild: 1,
  build: 1,
  create: 1,
  aggregate: 2,
  all: 0,
  find: 0,
  findAll: 0,
  findAndCount: 0,
  findAndCountAll: 0,
  findById: 1,
  findByPrimary: 1,
  findCreateFind: 0,
  findOne: 0,
  findOrBuild: 0,
  findOrCreate: 0,
  findOrInitialize: 0,
  reload: 0,
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
export function getModels(arg: Array<typeof Model | string>): Array<typeof Model> {

  if (arg) {

    return arg.reduce((models: any[], dir) => {

      if (typeof dir !== 'string') {
        models.push(dir);
        return models;
      }

      const _models = fs
        .readdirSync(dir as string)
        .filter(isImportable)
        .map(getFilenameWithoutExtension)
        .filter(uniqueFilter)
        .map(fileName => {
          const fullPath = path.join(dir, fileName);
          const module = require(fullPath);

          if (!module[fileName] && !module.default) {
            throw new Error(`No default export defined for file "${fileName}" or ` +
              `export does not satisfy filename.`);
          }
          return module[fileName] || module.default;
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
 * Pre conform includes, so that "as" value can be inferred from source
 */
export function inferAlias(options: any, source: any): any {

  options = {...options};

  if (!options.include) {
    return options;
  }
  // if include is not an array, wrap in an array
  if (!Array.isArray(options.include)) {
    options.include = [options.include];
  } else if (!options.include.length) {
    delete options.include;
    return options;
  }

  // convert all included elements to { model: Model } form
  options.include = options.include.map((include) => {
    include = inferAliasForInclude(include, source);

    return include;
  });

  return options;
}

/**
 * Pre conform include, so that alias ("as") value can be inferred from source class
 */
function inferAliasForInclude(include: any, source: any): any {
  const hasModelOptionWithoutAsOption = !!(include.model && !include.as);
  const hasIncludeOptions = !!include.include;
  const isConstructorFn = include instanceof Function;

  if (isConstructorFn || hasModelOptionWithoutAsOption) {

    if (isConstructorFn) {
      include = {model: include};
    }

    const targetPrototype = (source[PROPERTY_LINK_TO_ORIG] || source).prototype || source;
    const relatedClass = include.model;
    const associations = getAssociationsByRelation(targetPrototype, relatedClass);

    if (associations.length > 0) {
      if (associations.length > 1) {
        throw new Error(`Alias cannot be inferred: "${source.name}" has multiple ` +
          `relations with "${include.model.name}"`);
      }
      include.as = associations[0].as;
    }
  }

  if (!isConstructorFn && hasIncludeOptions) {
    include = inferAlias(include, include.model);
  }

  return include;
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
 * Removes extension of specified filename and returns this value
 */
function getFilenameWithoutExtension(file: string): string {
  return path.parse(file).name;
}
