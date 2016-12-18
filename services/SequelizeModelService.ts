import 'reflect-metadata';
import Sequelize = require("sequelize");
import {Model} from "../models/Model";
import {DefineOptions} from "sequelize";
import {DataType} from "../models/DataType";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";
import {DefineAttributeColumnOptions} from "sequelize";

export class SequelizeModelService {

  private static MODEL_NAME_KEY = 'sequelize:modelName';
  private static ATTRIBUTES_KEY = 'sequelize:attributes';
  private static OPTIONS_KEY = 'sequelize:options';
  private static FOREIGN_KEYS_KEY = 'sequelize:foreignKey';

  private static DEFAULT_OPTIONS: DefineOptions<any> = {
    timestamps: false
  };

  /**
   * Sets table name from class by storing this
   * information through reflect metadata
   */
  static setTableName(_class: typeof Model, tableName) {

    const options = this.getOptions(_class);

    if(!options.tableName) options.tableName = tableName;
  }

  /**
   * Sets model name from class by storing this
   * information through reflect metadata
   */
  static setModelName(_class: typeof Model, modelName) {

    Reflect.defineMetadata(this.MODEL_NAME_KEY, modelName, _class);
  }

  /**
   * Returns model name from class by restoring this
   * information from reflect metadata
   */
  static getModelName(_class: typeof Model) {

    return Reflect.getMetadata(this.MODEL_NAME_KEY, _class);
  }

  /**
   * Returns model attributes from class by restoring this
   * information from reflect metadata
   */
  static getAttributes(_class: typeof Model) {

    let attributes = Reflect.getMetadata(this.ATTRIBUTES_KEY, _class);

    if(!attributes) {
      attributes = {};
      Reflect.defineMetadata(this.ATTRIBUTES_KEY, attributes, _class);
    }

    return attributes;
  }

  /**
   * Adds model attribute by specified property name and
   * sequelize attribute options and stores this information
   * through reflect metadata
   */
  static addAttribute(_class: typeof Model, name: string, options: any) {

    let attributes = this.getAttributes(_class);

    attributes[name] = options;
  }

  /**
   * Returns attribute meta data of specified class and property name
   */
  static getAttributeOptions(_class: typeof Model, name: string): DefineAttributeColumnOptions {

    let attributes = this.getAttributes(_class);

    if(!attributes[name]) {
      attributes[name] = {};
    }

    return attributes[name];
  }

  /**
   * Returns sequelize define options from class by restoring this
   * information from reflect metadata
   */
  static getOptions(_class: typeof Model): DefineOptions<any> {

    let options = Reflect.getMetadata(this.OPTIONS_KEY, _class);

    if (!options) {
      options = this.createDefaultOptions();
      Reflect.defineMetadata(this.OPTIONS_KEY, options, _class);
    }

    return options;
  }

  /**
   * Maps design types to sequelize data types;
   * @throws if design type cannot be automatically mapped to
   * a sequelize data type
   */
  static getSequelizeTypeByDesignType(target: any, propertyName: string) {

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
  static addForeignKey(_class: typeof Model, relatedClassGetter: () => typeof Model, propertyName: string) {

    const foreignKeys = this.getForeignKeys(_class);

    foreignKeys.push({
      relatedClassGetter,
      foreignKey: propertyName
    })
  }

  /**
   * Extends currently set options with specified additional options
   */
  static extendOptions(_class: any, additionalOptions: DefineOptions<any>) {

    const options = this.getOptions(_class);

    for(let key in additionalOptions) {
      if(additionalOptions.hasOwnProperty(key)) {

        options[key] = additionalOptions[key];
      }
    }
  }

  /**
   * Returns foreign key meta data from specified class
   */
  private static getForeignKeys(_class: typeof Model): ISequelizeForeignKeyConfig[] {

    let foreignKeys = Reflect.getMetadata(this.FOREIGN_KEYS_KEY, _class);

    if (!foreignKeys) {
      foreignKeys = [];
      Reflect.defineMetadata(this.FOREIGN_KEYS_KEY, foreignKeys, _class);
    }

    return foreignKeys;
  }

  /**
   * Creates default options for sequelize define options
   */
  private static createDefaultOptions(): DefineOptions<any> {

    let options = {};

    for (let key in this.DEFAULT_OPTIONS) {
      if (this.DEFAULT_OPTIONS.hasOwnProperty(key)) {
        options[key] = this.DEFAULT_OPTIONS[key];
      }
    }

    return options;
  }

}
