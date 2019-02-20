import {BelongsToManyOptions as OriginBelongsToManyOptions} from 'sequelize';
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {ThroughOptions} from "../through/through-options";


export type BelongsToManyOptions = {
  [K in keyof OriginBelongsToManyOptions]: K extends 'through'
    ? ModelClassGetter | string | ThroughOptions
    : OriginBelongsToManyOptions[K]
};
