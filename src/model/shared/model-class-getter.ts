import {Model} from "../model/model";

export type ModelClassGetter = (returns?: void) => typeof Model;
