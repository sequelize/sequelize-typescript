import {ScopeFindOptions} from "./scope-find-options";

export interface ScopeTableOptions {
  [scopeName: string]: ScopeFindOptions | Function | undefined;
}
