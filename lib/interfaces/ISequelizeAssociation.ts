import {AssociationOptionsBelongsTo, AssociationOptionsBelongsToMany, AssociationOptionsHasMany,
  AssociationOptionsHasOne, AssociationOptionsManyToMany} from 'sequelize';
import {ModelClassGetter} from "../types/ModelClassGetter";

export interface ISequelizeAssociation {

  relation: string;
  relatedClassGetter: ModelClassGetter;
  through?: string;
  throughClassGetter?: ModelClassGetter;
  options?: AssociationOptionsBelongsTo | AssociationOptionsBelongsToMany | AssociationOptionsHasMany |
    AssociationOptionsHasOne | AssociationOptionsManyToMany;
  as: string;
}
