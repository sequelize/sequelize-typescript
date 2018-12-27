import {Model} from '../model/model';
import {Omit, RecursivePartial} from '../../shared/types';

export type FilteredModelAttributes<T extends Model<T>> =
  RecursivePartial<Omit<T, keyof Model<any>>> & {
  id?: number | any;
  createdAt?: Date | any;
  updatedAt?: Date | any;
  deletedAt?: Date | any;
  version?: number | any;
};
