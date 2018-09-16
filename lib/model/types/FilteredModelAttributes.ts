import {Model} from '../models/Model';
import {Omit, RecursivePartial} from '../../common/utils/types';

export type FilteredModelAttributes<T extends Model<T>> =
  RecursivePartial<Omit<T, keyof Model<any>>> & {
  id?: number | any;
  createdAt?: Date | any;
  updatedAt?: Date | any;
  deletedAt?: Date | any;
  version?: number | any;
};

class S extends Model<S> {

  id: number;

  name: string;

}

class T extends Model<T> {

  test: string;

  s: S[];

  get p(): any {
    return this.getDataValue('test');
  }
}

function f(t: FilteredModelAttributes<T>): any {

}

f({test: 'sdf', s: [{name: 'dsf', id: 1}]});
