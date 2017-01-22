import { Model } from "../models/Model";
export interface ISequelizeForeignKeyConfig {
    relatedClassGetter: () => typeof Model;
    foreignKey: string;
}
