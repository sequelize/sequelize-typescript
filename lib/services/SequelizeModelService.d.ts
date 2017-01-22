/// <reference types="sequelize" />
import 'reflect-metadata';
import { DataTypeAbstract, DefineOptions, DefineAttributeColumnOptions } from 'sequelize';
import { Model } from "../models/Model";
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
    static setTableName(prototype: any, tableName: string): void;
    /**
     * Sets model name from class by storing this
     * information through reflect metadata
     */
    static setModelName(prototype: any, modelName: string): void;
    /**
     * Returns model name from class by restoring this
     * information from reflect metadata
     */
    static getModelName(prototype: any): string;
    /**
     * Returns model attributes from class by restoring this
     * information from reflect metadata
     */
    static getAttributes(prototype: any): any;
    /**
     * Adds model attribute by specified property name and
     * sequelize attribute options and stores this information
     * through reflect metadata
     */
    static addAttribute(prototype: any, name: string, options: any): void;
    /**
     * Returns attribute meta data of specified class and property name
     */
    static getAttributeOptions(prototype: any, name: string): DefineAttributeColumnOptions;
    /**
     * Returns sequelize define options from class by restoring this
     * information from reflect metadata
     */
    static getOptions(prototype: any): DefineOptions<any>;
    /**
     * Maps design types to sequelize data types;
     * @throws if design type cannot be automatically mapped to
     * a sequelize data type
     */
    static getSequelizeTypeByDesignType(prototype: any, propertyName: string): DataTypeAbstract;
    /**
     * Adds foreign key meta data for specified class
     */
    static addForeignKey(prototype: any, relatedClassGetter: () => typeof Model, propertyName: string): void;
    /**
     * Extends currently set options with specified additional options
     */
    static extendOptions(prototype: any, additionalOptions: DefineOptions<any>): void;
    /**
     * Returns foreign key meta data from specified class
     */
    private static getForeignKeys(prototype);
    /**
     * Creates default options for sequelize define options
     */
    private static createDefaultOptions();
}
