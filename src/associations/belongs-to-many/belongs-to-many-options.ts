import { BelongsToManyOptions as OriginBelongsToManyOptions } from 'sequelize';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { ThroughOptions } from '../through/through-options';

export type BelongsToManyOptions<TCreationAttributesThrough extends {}, TModelAttributesThrough extends {}> = {
  [K in keyof OriginBelongsToManyOptions]: K extends 'through'
    ?
        | ModelClassGetter<TCreationAttributesThrough, TModelAttributesThrough>
        | string
        | ThroughOptions<TCreationAttributesThrough, TModelAttributesThrough>
    : OriginBelongsToManyOptions[K];
};
