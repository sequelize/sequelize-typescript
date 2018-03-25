import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {IPreparedThroughOptions} from '../../model/interfaces/IPreparedThroughOptions';

export interface IPreparedAssociationOptionsBelongsToMany extends AssociationOptionsManyToMany {
  through: IPreparedThroughOptions;
  otherKey?: string | AssociationForeignKeyOptions;
}
