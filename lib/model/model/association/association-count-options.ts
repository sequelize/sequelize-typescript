import {WhereOptions} from 'sequelize';
import {Model} from '../../index';
import {FilteredModelAttributes} from '../../shared/filtered-model-attributes';

export interface AssociationCountOptions<T extends Model<T>> {
  where: WhereOptions<FilteredModelAttributes<T>>;
  scope: string | boolean;
}
