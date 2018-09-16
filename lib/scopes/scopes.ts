import 'reflect-metadata';
import {addScopeOptions} from "./scope/scope-service";
import {ScopeTableOptions} from "./scope/scope-table-options";

/**
 * Sets scopes for annotated class
 */
export function Scopes(scopes: ScopeTableOptions): Function {

  return (target: any) => {

    addScopeOptions(target.prototype, scopes);
  };
}
