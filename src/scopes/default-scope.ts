import { addScopeOptions, addScopeOptionsGetter } from './scope-service';
import { ScopeFindOptions } from './scope-find-options';
import { DefaultScopeGetter } from './scope-options';

/**
 * Decorator for defining default Model scope
 */
export function DefaultScope(scopeGetter: DefaultScopeGetter): Function;

/**
 * Decorator for defining default Model scope
 * @deprecated
 */
export function DefaultScope<TCreationAttributes extends {}, TModelAttributes extends {}>(
  scope: ScopeFindOptions<TCreationAttributes, TModelAttributes>
): Function;

/**
 * Decorator for defining default Model scope
 */
export function DefaultScope<TCreationAttributes extends {}, TModelAttributes extends {}>(
  scopeOrSsopeGetter: ScopeFindOptions<TCreationAttributes, TModelAttributes> | DefaultScopeGetter
): Function {
  return (target: any) => {
    if (typeof scopeOrSsopeGetter === 'function') {
      addScopeOptionsGetter(target.prototype, { getDefaultScope: scopeOrSsopeGetter });
    } else {
      addScopeOptions(target.prototype, { defaultScope: scopeOrSsopeGetter });
    }
  };
}
