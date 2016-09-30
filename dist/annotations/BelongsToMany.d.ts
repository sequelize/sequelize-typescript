import { Model } from "../models/Model";
export declare function BelongsToMany(relatedClassGetter: () => typeof Model, throughClass: () => typeof Model): any;
export declare function BelongsToMany(relatedClassGetter: () => typeof Model, through: string, foreignKey?: string): any;
