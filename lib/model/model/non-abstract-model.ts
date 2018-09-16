import {NonAbstract} from '../../shared/types';
import {Model} from './model';

export type NonAbstractModel<T> = (new () => T) & NonAbstract<typeof Model>;
