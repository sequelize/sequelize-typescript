import { Model } from '../../Model';

export type NonAbstract<T> = { [P in keyof T]: T[P] };
export type StaticMembers = NonAbstract<typeof Model>;
export type Constructor<T> = new () => T;
export type ModelType<T> = Constructor<T> & StaticMembers;
export type Repository<T> = ModelType<T>;
