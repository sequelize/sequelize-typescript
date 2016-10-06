import { Model } from "../models/Model";
export declare function ForeignKey(relatedClassGetter: () => typeof Model): (target: any, propertyName: string) => void;
