import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {ModelClassGetter} from "../types/ModelClassGetter";
import {IThroughOptions} from './IThroughOptions';

export interface IAssociationOptionsBelongsToMany extends AssociationOptionsManyToMany {
  through: ModelClassGetter | string | IThroughOptions;
  otherKey?: string | AssociationForeignKeyOptions;
  foreignKey?: string | AssociationForeignKeyOptions;
}
