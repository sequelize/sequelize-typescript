import 'reflect-metadata';
import { Model } from "../models/Model";
import { ISequelizeAssociation } from "../interfaces/ISequelizeAssociation";
export declare const BELONGS_TO_MANY: string;
export declare const BELONGS_TO: string;
export declare const HAS_MANY: string;
export declare const HAS_ONE: string;
/**
 * Stores association meta data for specified class
 */
export declare function addAssociation(target: any, relation: string, relatedClassGetter: () => typeof Model, as: string, through?: (() => typeof Model) | string, foreignKey?: string): void;
/**
 * Determines foreign key by specified association (relation)
 */
export declare function getForeignKey(_class: typeof Model, association: ISequelizeAssociation): string;
/**
 * Returns association meta data from specified class
 */
export declare function getAssociations(target: any): ISequelizeAssociation[] | undefined;
export declare function setAssociations(target: any, associations: ISequelizeAssociation[]): void;
/**
 * Adds foreign key meta data for specified class
 */
export declare function addForeignKey(target: any, relatedClassGetter: () => typeof Model, propertyName: string): void;
