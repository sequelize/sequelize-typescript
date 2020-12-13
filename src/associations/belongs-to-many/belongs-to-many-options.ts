import {BelongsToManyOptions as OriginBelongsToManyOptions} from 'sequelize';
import {ModelClassGetter} from "../../model/shared/model-class-getter";
import {ThroughOptions} from "../through/through-options";


export type BelongsToManyOptions<TCreationAttributes, TModelAttributes> = {
  [K in keyof OriginBelongsToManyOptions]: K extends 'through'
    ? ModelClassGetter<TCreationAttributes, TModelAttributes> | string | ThroughOptions<TCreationAttributes, TModelAttributes>
    : OriginBelongsToManyOptions[K]
};
