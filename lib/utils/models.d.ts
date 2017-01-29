/// <reference types="sequelize" />
import 'reflect-metadata';
import { DataTypeAbstract, DefineOptions, DefineAttributeColumnOptions } from 'sequelize';
import { Model } from "../models/Model";
/**
 * Sets table name from class by storing this
 * information through reflect metadata
 */
export declare function setTableName(target: any, tableName: string): void;
/**
 * Sets model name from class by storing this
 * information through reflect metadata
 */
export declare function setModelName(target: any, modelName: string): void;
/**
 * Returns model name from class by restoring this
 * information from reflect metadata
 */
export declare function getModelName(target: any): string;
/**
 * Returns model attributes from class by restoring this
 * information from reflect metadata
 */
export declare function getAttributes(target: any): any;
/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export declare function addAttribute(target: any, name: string, options: any): void;
/**
 * Returns attribute meta data of specified class and property name
 */
export declare function getAttributeOptions(target: any, name: string): DefineAttributeColumnOptions;
export declare function setAttributeOptions(target: any, attrName: string, options: DefineAttributeColumnOptions): void;
export declare function addAttributeOption(target: any, attrName: string, option: any): void;
/**
 * Sets attributes
 */
export declare function setAttributes(target: any, attributes: any): void;
/**
 * Returns sequelize define options from class by restoring this
 * information from reflect metadata
 */
export declare function getOptions(target: any): DefineOptions<any>;
/**
 * Maps design types to sequelize data types;
 * @throws if design type cannot be automatically mapped to
 * a sequelize data type
 */
export declare function getSequelizeTypeByDesignType(target: any, propertyName: string): DataTypeAbstract;
/**
 * Adds foreign key meta data for specified class
 */
export declare function addForeignKey(target: any, relatedClassGetter: () => typeof Model, propertyName: string): void;
/**
 * Extends currently set options with specified additional options
 */
export declare function extendOptions(target: any, additionalOptions: DefineOptions<any>): void;
