import {WhereOptions} from 'sequelize';
import {FilteredModelAttributes, Model} from '..';

export interface IAssociationGetOptions<T extends Model<T>> {
  where: WhereOptions<FilteredModelAttributes<T>>;
  scope: string | boolean;
  schema: string;
}
