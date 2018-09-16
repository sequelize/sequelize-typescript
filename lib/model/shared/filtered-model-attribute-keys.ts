import {FilteredModelAttributes} from './filtered-model-attributes';
import {Model} from '../';

export type FilteredModelAttributeKeys<T extends Model<T>> = keyof FilteredModelAttributes<T>;
