import { Model } from "../models/Model";
export interface ISequelizeAssociation {
    relation: string;
    relatedClassGetter: () => typeof Model;
    through?: string;
    throughClassGetter?: () => typeof Model;
    foreignKey?: string;
    otherKey?: string;
    as: string;
}
