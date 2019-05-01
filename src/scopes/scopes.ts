import {addScopeOptions, addScopeOptionsGetter} from "./scope-service";
import {ScopeTableOptions} from "./scope-table-options";
import {ScopesOptionsGetter} from "./scope-options";

/**
 * Decorator for defining Model scopes
 */
export function Scopes(scopesGetter: ScopesOptionsGetter): Function;

/**
 * Decorator for defining Model scopes
 * @deprecated
 */
export function Scopes(scopes: ScopeTableOptions): Function;

/**
 * Decorator for defining Model scopes
 */
export function Scopes(scopesOrScopesGetter: ScopeTableOptions | ScopesOptionsGetter): Function {
  return (target: any) => {
    if (typeof scopesOrScopesGetter === 'function') {
      addScopeOptionsGetter(target.prototype, {
        getScopes: scopesOrScopesGetter,
      });
    } else {
      addScopeOptions(target.prototype, scopesOrScopesGetter);
    }
  };
}
