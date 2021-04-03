import { Association, FindOptions, IncludeOptions } from 'sequelize';
import { ModelClassGetter } from '../model/shared/model-class-getter';

export type ScopeIncludeOptions<TCreationAttributes, TModelAttributes> = {
  [K in keyof IncludeOptions]: K extends 'model'
    ? ModelClassGetter<TCreationAttributes, TModelAttributes>
    : K extends 'include'
    ? ScopeIncludeOptions<TCreationAttributes, TModelAttributes>
    : IncludeOptions[K];
};

export type ScopeFindOptions<TCreationAttributes, TModelAttributes> = {
  [K in keyof FindOptions]: K extends 'include'
    ?
        | ModelClassGetter<TCreationAttributes, TModelAttributes>[]
        | Association[]
        | ScopeIncludeOptions<TCreationAttributes, TModelAttributes>[]
        | { all: true }
    : FindOptions[K];
};
