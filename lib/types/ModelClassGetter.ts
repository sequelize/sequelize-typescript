import {Model} from "../models/Model";

export type ModelClassGetter = (returns?: void) => typeof Model;
