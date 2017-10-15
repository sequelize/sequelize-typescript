import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {IPreparedThroughOptions} from './IPreparedThroughOptions';

export interface IPreparedAssociationOptionsBelongsToMany extends AssociationOptionsManyToMany {
  through: IPreparedThroughOptions;
  otherKey?: string | AssociationForeignKeyOptions;
}
