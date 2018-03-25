import {NonAbstract} from '../utils/types';
import {Model} from '../models/Model';

export type NonAbstractTypeOfModel<T> = (new () => T) & NonAbstract<typeof Model>;
