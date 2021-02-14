import {ScopeFindOptions} from "./scope-find-options";

export interface ScopeTableOptions<TCreationAttributes, TModelAttributes> {
  [scopeName: string]: ScopeFindOptions<TCreationAttributes, TModelAttributes> | Function | undefined;
}
