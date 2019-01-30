import {Model, NonAbstractTypeOfModel} from "../models/Model";

export type ModelClassGetter<T = Model<any>> = (returns?: void) => NonAbstractTypeOfModel<T>;
