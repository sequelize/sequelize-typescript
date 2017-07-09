import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {ModelClassGetter} from "../types/ModelClassGetter";

export interface IAssociationOptionsBelongsToMany extends AssociationOptionsManyToMany {
  through: ModelClassGetter | string;
  otherKey?: string | AssociationForeignKeyOptions;
}
