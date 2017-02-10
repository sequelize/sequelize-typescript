import { Model } from "../models/Model";
export declare function BelongsTo(relatedClassGetter: () => typeof Model, foreignKey?: string): Function;
