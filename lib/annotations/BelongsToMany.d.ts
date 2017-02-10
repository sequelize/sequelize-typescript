import { Model } from "../models/Model";
export declare function BelongsToMany(relatedClassGetter: () => typeof Model, through: (() => typeof Model) | string, foreignKey?: string, otherKey?: string): Function;
