import {Association, FindOptions, IncludeOptions} from "sequelize";
import {ModelClassGetter} from "../model/shared/model-class-getter";

export type ScopeIncludeOptions = {
  [K in keyof IncludeOptions]: K extends 'model'
    ? ModelClassGetter
    : (K extends 'include'
      ? ScopeIncludeOptions
      : IncludeOptions[K])
};

export type ScopeFindOptions = {
  [K in keyof FindOptions]: K extends 'include'
    ? ModelClassGetter[] | Association[] | ScopeIncludeOptions[] | { all: true }
    : FindOptions[K]
};
