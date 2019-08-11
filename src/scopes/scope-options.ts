import {ScopeTableOptions} from './scope-table-options';
import {ScopeFindOptions} from "./scope-find-options";
import {FindOptions} from "sequelize";

export interface ScopeOptions extends ScopeTableOptions {
  defaultScope?: ScopeFindOptions;
}

export interface ScopeOptionsGetters {
  getDefaultScope?: DefaultScopeGetter;
  getScopes?: ScopesOptionsGetter;
}

export type DefaultScopeGetter = () => FindOptions;
export type ScopesOptionsGetter = () => ({[sopeName: string]: ScopesOptions});
export type ScopesOptions = FindOptions | ((...args: any[]) => FindOptions);
