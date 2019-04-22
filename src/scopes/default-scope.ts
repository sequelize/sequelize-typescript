import {addScopeOptions, addScopeOptionsGetter} from "./scope-service";
import {ScopeFindOptions} from "./scope-find-options";
import {DefaultScopeGetter} from "./scope-options";

/**
 * @deprecated
 */
export function DefaultScope(scope: ScopeFindOptions): Function;

export function DefaultScope(scopeGetter: DefaultScopeGetter): Function;

/**
 * Sets default scope for annotated class
 */
export function DefaultScope(scopeOrSsopeGetter: ScopeFindOptions | DefaultScopeGetter): Function {
  return (target: any) => {
    if (typeof scopeOrSsopeGetter === 'function') {
      addScopeOptionsGetter(target.prototype, {getDefaultScope: scopeOrSsopeGetter});
    } else {
      addScopeOptions(target.prototype, {defaultScope: scopeOrSsopeGetter});
    }
  };
}
