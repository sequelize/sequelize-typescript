import {Omit, RecursivePartial} from '../utils/types';
import {Model} from '../models/Model';

export type FilteredModelAttributes<T extends Model<T>> =
  RecursivePartial<Omit<T, keyof Model<any>>> & {
  id?: number | any;
  createdAt?: Date | any;
  updatedAt?: Date | any;
  deletedAt?: Date | any;
  version?: number | any;
};
