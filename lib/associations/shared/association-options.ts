import {
  AssociationOptionsBelongsTo, AssociationOptionsHasMany,
  AssociationOptionsHasOne, AssociationOptionsManyToMany
} from 'sequelize';
import {PreparedBelongsToManyAssociationOptions} from '../belongs-to-many/prepared-belongs-to-many-association-options';

export type AssociationOptions =
  AssociationOptionsBelongsTo |
  PreparedBelongsToManyAssociationOptions |
  AssociationOptionsHasMany |
  AssociationOptionsHasOne |
  AssociationOptionsManyToMany;
