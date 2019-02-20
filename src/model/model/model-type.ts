import {Model} from './model';

export type NonAbstract<T> = {[P in keyof T]: T[P]};

export type Constructor<T> = (new (...args: any[]) => T);

export type ModelType<T extends Model<T>> = (Constructor<T> & NonAbstract<typeof Model>);
