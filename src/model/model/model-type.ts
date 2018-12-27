import {Constructor, NonAbstract} from '../../shared/types';
import {Model} from './model';

export type ModelType<T extends Model<T>> = (Constructor<T> & NonAbstract<typeof Model>);
