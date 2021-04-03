import { BelongsToOptions, HasManyOptions, HasOneOptions, ManyToManyOptions } from 'sequelize';

export type UnionAssociationOptions =
  | BelongsToOptions
  | HasManyOptions
  | HasOneOptions
  | ManyToManyOptions;
