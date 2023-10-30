import { ScopeTableOptions } from './scope-table-options';
import { ScopeFindOptions } from './scope-find-options';
import { FindOptions } from 'sequelize';

export interface ScopeOptions<TCreationAttributes extends {}, TModelAttributes extends {}>
  extends ScopeTableOptions<TCreationAttributes, TModelAttributes> {
  defaultScope?: ScopeFindOptions<TCreationAttributes, TModelAttributes>;
}

export interface ScopeOptionsGetters {
  getDefaultScope?: DefaultScopeGetter;
  getScopes?: ScopesOptionsGetter;
}

export type DefaultScopeGetter = () => FindOptions;

/**
 * This is the type that you should use if adding a new set of scopes
 * @example
 * const myModelScopes: ScopesOptionsGetter = ()  => ({
 *  scopeOne: FindOptions & IncludeOptions {
 *    return {...}
 *  },
 *  scopeTwo: FindOptions {
 *    return {...}
 *  }
 * })
 */
export type ScopesOptionsGetter = () => { [sopeName: string]: ScopesOptions };
export type ScopesOptions = FindOptions | ((...args: any[]) => FindOptions);
