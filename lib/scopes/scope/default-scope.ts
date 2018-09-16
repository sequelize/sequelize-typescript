import 'reflect-metadata';
import {addScopeOptions} from "./scope-service";
import {ScopeFindOptions} from "./find-include/scope-find-options";

/**
 * Sets default scope for annotated class
 */
export function DefaultScope(scope: ScopeFindOptions | Function): Function {

  return (target: any) => {

    addScopeOptions(target.prototype, {
      defaultScope: scope
    });
  };
}
