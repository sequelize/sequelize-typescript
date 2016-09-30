import { Model } from "../models/Model";
export declare function HasOne(relatedClassGetter: () => typeof Model, foreignKey?: string): (target: any, propertyName: string) => void;
