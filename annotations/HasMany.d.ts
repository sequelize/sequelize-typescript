import { Model } from "../models/Model";
export declare function HasMany(relatedClassGetter: () => typeof Model, foreignKey?: string): (target: any, propertyName: string) => void;
