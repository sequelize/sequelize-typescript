import {AssociationOptionsBelongsTo, AssociationOptionsBelongsToMany, AssociationOptionsHasMany,
  AssociationOptionsHasOne, AssociationOptionsManyToMany} from 'sequelize';
import {Model} from "../models/Model";

export interface ISequelizeAssociation {

  relation: string;
  relatedClassGetter: () => typeof Model;
  through?: string;
  throughClassGetter?: () => typeof Model;
  options?: AssociationOptionsBelongsTo | AssociationOptionsBelongsToMany | AssociationOptionsHasMany |
    AssociationOptionsHasOne | AssociationOptionsManyToMany;
  otherKey?: string;
  as: string;
}
