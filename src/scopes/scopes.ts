import {addScopeOptions} from "./shared/scope-service";
import {ScopeTableOptions} from "./shared/scope-table-options";

/**
 * Sets scopes for annotated class
 */
export function Scopes(scopes: ScopeTableOptions): Function {

  return (target: any) => {

    addScopeOptions(target.prototype, scopes);
  };
}
