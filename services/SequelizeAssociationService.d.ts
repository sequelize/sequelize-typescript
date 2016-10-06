import 'reflect-metadata';
import { Model } from "../models/Model";
import { ISequelizeAssociation } from "../interfaces/ISequelizeAssociation";
export declare class SequelizeAssociationService {
    private static FOREIGN_KEYS_KEY;
    private static ASSOCIATIONS_KEY;
    static BELONGS_TO_MANY: string;
    static BELONGS_TO: string;
    static HAS_MANY: string;
    static HAS_ONE: string;
    /**
     * Stores association meta data for specified class
     */
    static addAssociation(_class: typeof Model, relation: string, relatedClassGetter: () => typeof Model, as: string, through?: (() => typeof Model) | string, foreignKey?: string): void;
    /**
     * Determines foreign key by specified association (relation)
     */
    static getForeignKey(_class: typeof Model, association: ISequelizeAssociation): string;
    /**
     * Returns association meta data from specified class
     */
    static getAssociations(_class: typeof Model): ISequelizeAssociation[];
    /**
     * Adds foreign key meta data for specified class
     */
    static addForeignKey(_class: typeof Model, relatedClassGetter: () => typeof Model, propertyName: string): void;
    /**
     * Returns foreign key meta data from specified class
     */
    private static getForeignKeys(_class);
}
