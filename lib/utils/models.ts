import 'reflect-metadata';
import {DataTypeAbstract, DefineOptions, DefineAttributeColumnOptions} from 'sequelize';
import {Model} from "../models/Model";
import {DataType} from "../models/DataType";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";

const MODEL_NAME_KEY = 'sequelize:modelName';
const ATTRIBUTES_KEY = 'sequelize:attributes';
const OPTIONS_KEY = 'sequelize:options';
const FOREIGN_KEYS_KEY = 'sequelize:foreignKey';
const DEFAULT_OPTIONS: DefineOptions<any> = {
  timestamps: false
};

/**
 * Sets table name from class by storing this
 * information through reflect metadata
 */
export function setTableName(target: any, tableName: string): void {

  const options = getOptions(target);

  if (!options.tableName) options.tableName = tableName;
}

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
export function getAttributes(target: any): any {

  return Reflect.getMetadata(ATTRIBUTES_KEY, target);
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

  attributes[name] = options;
}

/**
 * Returns attribute meta data of specified class and property name
 */
export function getAttributeOptions(target: any,
                                    name: string): DefineAttributeColumnOptions {

  const attributes = getAttributes(target);

  return attributes[name];
}

export function setAttributeOptions(target: any,
                                    attrName: string,
                                    options: DefineAttributeColumnOptions): void {
  let attributes = getAttributes(target);

  if (!attributes) {
    attributes = {};
    setAttributes(target, attributes);
  }

  attributes[attrName] = options;
}

export function addAttributeOption(target: any,
                                   attrName: string,
                                   option: any): void {

  let
}

/**
 * Sets attributes
 */
export function setAttributes(target: any, attributes: any): void {

  Reflect.defineMetadata(ATTRIBUTES_KEY, attributes, target);
}

/**
 * Returns sequelize define options from class by restoring this
 * information from reflect metadata
 */
export function getOptions(target: any): DefineOptions<any> {

  let options = Reflect.getMetadata(OPTIONS_KEY, target);

  if (!options) {
    options = createDefaultOptions();
    Reflect.defineMetadata(OPTIONS_KEY, options, target);
  }

  return options;
}

/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
export function getSequelizeTypeByDesignType(target: any, propertyName: string): DataTypeAbstract {

  const type = Reflect.getMetadata('design:type', target, propertyName);

  switch (type) {
    case String:
      return DataType.STRING;
    case Number:
      return DataType.INTEGER;
    case Boolean:
      return DataType.BOOLEAN;
    case Date:
      return DataType.TIME;
    default:
      throw new Error(`Specified type of property '${propertyName}' 
            cannot be automatically resolved to a sequelize data type. Please
            define the data type manually`);
  }
}

/**
 * Adds foreign key meta data for specified class
 */
export function addForeignKey(target: any,
                              relatedClassGetter: () => typeof Model,
                              propertyName: string): void {

  const foreignKeys = getForeignKeys(target);

  foreignKeys.push({
    relatedClassGetter,
    foreignKey: propertyName
  });
}

/**
 * Extends currently set options with specified additional options
 */
export function extendOptions(target: any, additionalOptions: DefineOptions<any>): void {

  const options = getOptions(target);

  for (const key in additionalOptions) {

    if (additionalOptions.hasOwnProperty(key)) {

      options[key] = additionalOptions[key];
    }
  }
}

/**
 * Returns foreign key meta data from specified class
 */
function getForeignKeys(target: any): ISequelizeForeignKeyConfig[] {

  let foreignKeys = Reflect.getMetadata(FOREIGN_KEYS_KEY, target);

  if (!foreignKeys) {
    foreignKeys = [];
    Reflect.defineMetadata(FOREIGN_KEYS_KEY, foreignKeys, target);
  }

  return foreignKeys;
}

/**
 * Creates default options for sequelize define options
 */
function createDefaultOptions(): DefineOptions<any> {

  const options = {};

  for (const key in DEFAULT_OPTIONS) {
    if (DEFAULT_OPTIONS.hasOwnProperty(key)) {
      options[key] = DEFAULT_OPTIONS[key];
    }
  }

  return options;
}
