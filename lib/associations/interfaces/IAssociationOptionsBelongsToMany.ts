import {AssociationForeignKeyOptions, AssociationOptionsManyToMany} from "sequelize";
import {ModelClassGetter} from '../../model/types/ModelClassGetter';
import {IThroughOptions} from '../../model/interfaces/IThroughOptions';

export interface IAssociationOptionsBelongsToMany extends AssociationOptionsManyToMany {
  through: ModelClassGetter | string | IThroughOptions;
  otherKey?: string | AssociationForeignKeyOptions;
}
