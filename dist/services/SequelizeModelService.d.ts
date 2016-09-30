/// <reference types="sequelize" />
import 'reflect-metadata';
import Sequelize = require("sequelize");
import { Model } from "../models/Model";
import { DefineOptions } from "sequelize";
import { DefineAttributeColumnOptions } from "sequelize";
export declare class SequelizeModelService {
    private static MODEL_NAME_KEY;
    private static ATTRIBUTES_KEY;
    private static OPTIONS_KEY;
    private static FOREIGN_KEYS_KEY;
    private static DEFAULT_OPTIONS;
    /**
     * Sets table name from class by storing this
     * information through reflect metadata
     */
    static setTableName(_class: typeof Model, tableName: any): void;
    /**
     * Sets model name from class by storing this
     * information through reflect metadata
     */
    static setModelName(_class: typeof Model, modelName: any): void;
    /**
     * Returns model name from class by restoring this
     * information from reflect metadata
     */
    static getModelName(_class: typeof Model): any;
    /**
     * Returns model attributes from class by restoring this
     * information from reflect metadata
     */
    static getAttributes(_class: typeof Model): any;
    /**
     * Adds model attribute by specified property name and
     * sequelize attribute options and stores this information
     * through reflect metadata
     */
    static addAttribute(_class: typeof Model, name: string, options: any): void;
    /**
     * Returns attribute meta data of specified class and property name
     */
    static getAttributeOptions(_class: typeof Model, name: string): DefineAttributeColumnOptions;
    /**
     * Returns sequelize define options from class by restoring this
     * information from reflect metadata
     */
    static getOptions(_class: typeof Model): DefineOptions<any>;
    /**
     * Maps design types to sequelize data types;
     * @throws if design type cannot be automatically mapped to
     * a sequelize data type
     */
    static getSequelizeTypeByDesignType(target: any, propertyName: string): Sequelize.DataTypeBoolean;
    /**
     * Adds foreign key meta data for specified class
     */
    static addForeignKey(_class: typeof Model, relatedClassGetter: () => typeof Model, propertyName: string): void;
    /**
     * Extends currently set options with specified additional options
     */
    static extendOptions(_class: any, additionalOptions: DefineOptions<any>): void;
    /**
     * Returns foreign key meta data from specified class
     */
    private static getForeignKeys(_class);
    /**
     * Creates default options for sequelize define options
     */
    private static createDefaultOptions();
}
