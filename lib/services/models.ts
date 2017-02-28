import 'reflect-metadata';
import * as deepAssign from 'deep-assign';
import * as fs from 'fs';
import * as path from 'path';
import {DataTypeAbstract, DefineOptions} from 'sequelize';
import {Model} from "../models/Model";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";
import {IPartialDefineAttributeColumnOptions} from "../interfaces/IPartialDefineAttributeColumnOptions";
import {inferDataType} from "../utils/data-type";

const MODEL_NAME_KEY = 'sequelize:modelName';
const ATTRIBUTES_KEY = 'sequelize:attributes';
const OPTIONS_KEY = 'sequelize:options';
const FOREIGN_KEYS_KEY = 'sequelize:foreignKey';
const DEFAULT_OPTIONS: DefineOptions<any> = {
  timestamps: false
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
export function getAttributes(target: any): any|undefined {

  return Reflect.getMetadata(ATTRIBUTES_KEY, target);
}

/**
 * Sets attributes
 */
export function setAttributes(target: any, attributes: any): void {

  Reflect.defineMetadata(ATTRIBUTES_KEY, attributes, target);
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
    setAttributes(target, attributes);
  }

  attributes[name] = Object.assign({}, options);
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
}

/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
export function getOptions(target: any): DefineOptions<any>|undefined {

  return Reflect.getMetadata(OPTIONS_KEY, target);
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
 * Adds foreign key meta data for specified class
 */
export function addForeignKey(target: any,
                              relatedClassGetter: () => typeof Model,
                              propertyName: string): void {

  let foreignKeys = getForeignKeys(target);

  if (!foreignKeys) {
    foreignKeys = [];
    setForeignKeys(target, foreignKeys);
  }

  foreignKeys.push({
    relatedClassGetter,
    foreignKey: propertyName
  });
}

/**
 * Determines models from value
 */
export function getModels(arg: Array<typeof Model|string>): Array<typeof Model> {

  if (arg && typeof arg[0] === 'string') {

    return arg.reduce((models: any[], dir) => {

      const _models = fs
        .readdirSync(dir as string)
        .filter(file => ((file.indexOf('.') !== 0) && (file.slice(-3) === '.js')))
        .map(file => {
          const fullPath = path.join(dir, file);
          const modelName = path.basename(file, '.js');

          // use require main to require from root
          const module = require.main.require(fullPath);

          if (!module[modelName] && !module.default) {
            throw new Error(`No default export defined for file "${file}" or export does not satisfy filename.`);
          }
          return module[modelName];
        });

      models.push(..._models);

      return models;
    }, [])
      ;
  }

  return arg as Array<typeof Model>;
}

/**
 * Returns foreign key meta data from specified class
 */
function getForeignKeys(target: any): ISequelizeForeignKeyConfig[]|undefined {

  return Reflect.getMetadata(FOREIGN_KEYS_KEY, target);
}

/**
 * Set foreign key meta data for specified prototype
 */
function setForeignKeys(target: any, foreignKeys: ISequelizeForeignKeyConfig[]): void {

  Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
}
