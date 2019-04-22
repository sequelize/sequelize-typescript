import {addScopeOptions, addScopeOptionsGetter} from "./scope-service";
import {ScopeTableOptions} from "./scope-table-options";
import {ScopesOptionsGetter} from "./scope-options";

/**
 * @deprecated
 */
export function Scopes(scopes: ScopeTableOptions): Function;

export function Scopes(scopesGetter: ScopesOptionsGetter): Function;

/**
 * Sets scopes for annotated class
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
