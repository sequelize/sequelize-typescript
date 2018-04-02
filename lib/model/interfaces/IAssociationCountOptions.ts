import {WhereOptions} from 'sequelize';
import {FilteredModelAttributes, Model} from '..';

export interface IAssociationCountOptions<T extends Model<T>> {
  where: WhereOptions<FilteredModelAttributes<T>>;
  scope: string | boolean;
}
