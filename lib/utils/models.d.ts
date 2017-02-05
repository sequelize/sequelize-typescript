/// <reference types="sequelize" />
import 'reflect-metadata';
import { DataTypeAbstract, DefineOptions } from 'sequelize';
import { Model } from "../models/Model";
import { IPartialDefineAttributeColumnOptions } from "../interfaces/IPartialDefineAttributeColumnOptions";
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
export declare function getAttributes(target: any): any | undefined;
/**
 * Sets attributes
 */
export declare function setAttributes(target: any, attributes: any): void;
/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export declare function addAttribute(target: any, name: string, options: any): void;
export declare function addAttributeOptions(target: any, propertyName: string, options: IPartialDefineAttributeColumnOptions): void;
/**
 * Returns sequelize define options from class prototype
 * by restoring this information from reflect metadata
 */
export declare function getOptions(target: any): DefineOptions<any> | undefined;
export declare function setOptions(target: any, options: DefineOptions<any>): void;
export declare function addOptions(target: any, options: DefineOptions<any>): void;
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
