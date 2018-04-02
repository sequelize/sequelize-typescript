import {FilteredModelAttributes} from './FilteredModelAttributes';
import {Model} from '../';

export type FilteredModelAttributeKeys<T extends Model<T>> = keyof FilteredModelAttributes<T>;
