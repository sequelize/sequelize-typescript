import 'reflect-metadata';
import {DataTypeAbstract, DefineOptions, DefineAttributeColumnOptions} from 'sequelize';
import {Model} from "../models/Model";
import {DataType} from "../models/DataType";
import {ISequelizeForeignKeyConfig} from "../interfaces/ISequelizeForeignKeyConfig";

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
  static setTableName(target: any, tableName: string): void {

    const options = this.getOptions(target);

    if (!options.tableName) options.tableName = tableName;
  }

  /**
   * Sets model name from class by storing this
   * information through reflect metadata
   */
  static setModelName(target: any, modelName: string): void {

    Reflect.defineMetadata(this.MODEL_NAME_KEY, modelName, target);
  }

  /**
   * Returns model name from class by restoring this
   * information from reflect metadata
   */
  static getModelName(target: any): string {

    return Reflect.getMetadata(this.MODEL_NAME_KEY, target);
  }

  /**
   * Returns model attributes from class by restoring this
   * information from reflect metadata
   */
  static getAttributes(target: any): any {

    return Reflect.getMetadata(this.ATTRIBUTES_KEY, target);
  }

  /**
   * Adds model attribute by specified property name and
   * sequelize attribute options and stores this information
   * through reflect metadata
   */
  static addAttribute(target: any, name: string, options: any): void {

    let attributes = this.getAttributes(target);

    if (!attributes) {
      attributes = {};
      this.setAttributes(target, attributes);
    }

    attributes[name] = options;
  }

  /**
   * Returns attribute meta data of specified class and property name
   */
  static getAttributeOptions(target: any, name: string): DefineAttributeColumnOptions {

    let attributes = this.getAttributes(target);

    if (!attributes) {
      attributes = {};
      this.setAttributes(target, attributes);
    }

    if (!attributes[name]) {
      attributes[name] = {};
    }

    return attributes[name];
  }

  /**
   * Sets attributes
   */
  static setAttributes(target: any, attributes: any): void {

    Reflect.defineMetadata(this.ATTRIBUTES_KEY, attributes, target);
  }

  /**
   * Returns sequelize define options from class by restoring this
   * information from reflect metadata
   */
  static getOptions(target: any): DefineOptions<any> {

    let options = Reflect.getMetadata(this.OPTIONS_KEY, target);

    if (!options) {
      options = this.createDefaultOptions();
      Reflect.defineMetadata(this.OPTIONS_KEY, options, target);
    }

    return options;
  }

  /**
   * Maps design types to sequelize data types;
   * @throws if design type cannot be automatically mapped to
   * a sequelize data type
   */
  static getSequelizeTypeByDesignType(target: any, propertyName: string): DataTypeAbstract {

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
  static addForeignKey(target: any,
                       relatedClassGetter: () => typeof Model,
                       propertyName: string): void {

    const foreignKeys = this.getForeignKeys(target);

    foreignKeys.push({
      relatedClassGetter,
      foreignKey: propertyName
    });
  }

  /**
   * Extends currently set options with specified additional options
   */
  static extendOptions(target: any, additionalOptions: DefineOptions<any>): void {

    const options = this.getOptions(target);

    for (const key in additionalOptions) {

      if (additionalOptions.hasOwnProperty(key)) {

        options[key] = additionalOptions[key];
      }
    }
  }

  /**
   * Returns foreign key meta data from specified class
   */
  private static getForeignKeys(target: any): ISequelizeForeignKeyConfig[] {

    let foreignKeys = Reflect.getMetadata(this.FOREIGN_KEYS_KEY, target);

    if (!foreignKeys) {
      foreignKeys = [];
      Reflect.defineMetadata(this.FOREIGN_KEYS_KEY, foreignKeys, target);
    }

    return foreignKeys;
  }

  /**
   * Creates default options for sequelize define options
   */
  private static createDefaultOptions(): DefineOptions<any> {

    const options = {};

    for (const key in this.DEFAULT_OPTIONS) {
      if (this.DEFAULT_OPTIONS.hasOwnProperty(key)) {
        options[key] = this.DEFAULT_OPTIONS[key];
      }
    }

    return options;
  }

}
