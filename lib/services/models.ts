import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import {DataTypeAbstract, DefineOptions} from 'sequelize';
import {Model} from "../models/Model";
import {IPartialDefineAttributeColumnOptions} from "../interfaces/IPartialDefineAttributeColumnOptions";
import {inferDataType} from "../utils/data-type";
import {deepAssign} from "../utils/object";
import {IScopeOptions} from "../interfaces/IScopeOptions";
import {IFindOptions} from "../interfaces/IFindOptions";
import {getAssociationsByRelation} from "./association";
import {uniqueFilter} from "../utils/array";

const MODEL_NAME_KEY = 'sequelize:modelName';
const SCOPES_KEY = 'sequelize:scopes';
const ATTRIBUTES_KEY = 'sequelize:attributes';
const OPTIONS_KEY = 'sequelize:options';
const DEFAULT_OPTIONS: DefineOptions<any> = {
  timestamps: false
};
export const PROPERTY_LINK_TO_ORIG = '__origClass';

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
export function getAttributes(target: any): any|undefined {

  const attributes = Reflect.getMetadata(ATTRIBUTES_KEY, target);

  if (attributes) {

    return Object.keys(attributes).reduce((copy, key) => {

      copy[key] = Object.assign({}, attributes[key]);

      return copy;
    }, {});
  }
}

/**
 * Sets attributes
 */
export function setAttributes(target: any, attributes: any): void {

  Reflect.defineMetadata(ATTRIBUTES_KEY, Object.assign({}, attributes), target);
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
  attributes[name] = Object.assign({}, options);

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
export function getOptions(target: any): DefineOptions<any>|undefined {

  const options = Reflect.getMetadata(OPTIONS_KEY, target);

  if (options) {
    return Object.assign({}, options);
  }
}

/**
 * Sets seuqlize define options to class prototype
 */
export function setOptions(target: any, options: DefineOptions<any>): void {

  Reflect.defineMetadata(OPTIONS_KEY, Object.assign({}, DEFAULT_OPTIONS, options), target);
}

/**
 * Adds options be assigning new options to old one
 */
export function addOptions(target: any, options: DefineOptions<any>): void {

  let _options = getOptions(target);

  if (!_options) {
    _options = {};
  }

  setOptions(target, Object.assign(_options, options));
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
export function getModels(arg: Array<typeof Model|string>): Array<typeof Model> {

  if (arg && typeof arg[0] === 'string') {

    return arg.reduce((models: any[], dir) => {

      const _models = fs
        .readdirSync(dir as string)
        .filter(file => {
          const extension = file.slice(-3);
          return extension === '.js' || (extension === '.ts' && file.slice(-4) !== '.d.ts');
        })
        .map(file => path.parse(file).name)
        .filter(uniqueFilter)
        .map(fileName => {
          const fullPath = path.join(dir, fileName);
          const module = require(fullPath);

          if (!module[fileName] && !module.default) {
            throw new Error(`No default export defined for file "${fileName}" or export does not satisfy filename.`);
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
 * Resolves scopes and adds them to the specified models
 */
export function resolveScopes(models: Array<typeof Model>): void {

  models.forEach(model => {

    const options = getScopeOptions(model.prototype);

    if (options) {

      Object
        .keys(options)
        .forEach(key => {

          let scopeFindOptions = options[key];

          resolveModelGetter(scopeFindOptions);
          scopeFindOptions = preConformIncludes(scopeFindOptions, model);

          model.addScope(key, scopeFindOptions as IFindOptions, {override: true});
        });
    }
  });
}

/**
 * Resolves all model getters of specified options object
 * recursively.
 * So that {model: () => Person} will be converted to
 * {model: Person}
 */
export function resolveModelGetter(options: any): void {

  Object
    .keys(options)
    .forEach(key => {
      const value = options[key];

      if (typeof value === 'function' && value.length === 0) {
        const maybeModel = value();

        if (maybeModel && maybeModel.prototype && maybeModel.prototype instanceof Model) {
          options[key] = maybeModel;
        }
      } else if (value && typeof value === 'object') {
        resolveModelGetter(value);
      }
    });
}

/**
 * Adds scope option meta data for specified prototype
 */
export function addScopeOptions(target: any, options: IScopeOptions): void {

  const _options = getScopeOptions(target) || {};

  setScopeOptions(target, deepAssign({}, _options, options));
}

/**
 * Returns scope option meta data from specified target
 */
export function getScopeOptions(target: any): IScopeOptions|undefined {

  const options = Reflect.getMetadata(SCOPES_KEY, target);

  if (options) {

    return deepAssign({}, options);
  }
}

/**
 * Pre conform includes, so that "as" value can be inferred from source
 */
export function preConformIncludes(options: any, source: any): any {

  options = Object.assign({}, options);

  if (!options.include) {
    return options;
  }
  // if include is not an array, wrap in an array
  if (!Array.isArray(options.include)) {
    options.include = [options.include];
  } else if (!options.include.length) {
    delete options.include;
    return;
  }

  // convert all included elements to { model: Model } form
  options.include = options.include.map((include) => {
    include = preConformInclude(include, source);

    return include;
  });

  return options;
}

/**
 * Pre conform include, so that alias ("as") value can be inferred from source class
 */
function preConformInclude(include: any, source: any): any {

  const isConstructorFn = include instanceof Function;

  if (isConstructorFn || (include.model && !include.as)) {

    if (isConstructorFn) {
      include = {model: include};
    }

    const associations = getAssociationsByRelation((source[PROPERTY_LINK_TO_ORIG] || source).prototype || source, include.model);

    if (associations.length > 0) {

      if (associations.length > 1) {
        throw new Error(`Alias cannot be inferred: "${source.name}" has multiple relations with "${include.model.name}"`);
      }

      include.as = associations[0].as;
    }
  }

  if (!isConstructorFn && include.include) {
    include = preConformIncludes(include, include.model);
  }

  return include;
}

/**
 * Set scope option meta data for specified prototype
 */
function setScopeOptions(target: any, options: IScopeOptions): void {

  Reflect.defineMetadata(SCOPES_KEY, options, target);
}
