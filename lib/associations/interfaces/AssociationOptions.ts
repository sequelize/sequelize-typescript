import {
  AssociationOptionsBelongsTo, AssociationOptionsHasMany,
  AssociationOptionsHasOne, AssociationOptionsManyToMany
} from 'sequelize';
import {IPreparedAssociationOptionsBelongsToMany} from './IPreparedAssociationOptionsBelongsToMany';

export type AssociationOptions =
  AssociationOptionsBelongsTo |
  IPreparedAssociationOptionsBelongsToMany |
  AssociationOptionsHasMany |
  AssociationOptionsHasOne |
  AssociationOptionsManyToMany;
