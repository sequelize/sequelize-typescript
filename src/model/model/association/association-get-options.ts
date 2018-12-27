import {WhereOptions} from 'sequelize';
import {Model} from '../../index';
import {FilteredModelAttributes} from '../../shared/filtered-model-attributes';

export interface AssociationGetOptions<T extends Model<T>> {
  where: WhereOptions<FilteredModelAttributes<T>>;
  scope: string | boolean;
  schema: string;
}
