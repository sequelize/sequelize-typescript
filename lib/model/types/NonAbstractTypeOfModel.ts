import {NonAbstract} from '../../common/utils/types';
import {Model} from '../models/Model';

export type NonAbstractTypeOfModel<T> = (new () => T) & NonAbstract<typeof Model>;
