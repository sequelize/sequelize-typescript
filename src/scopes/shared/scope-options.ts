import {ScopeTableOptions} from './scope-table-options';
import {ScopeFindOptions} from "./scope-find-options";

export interface ScopeOptions extends ScopeTableOptions {

  defaultScope?: ScopeFindOptions | Function;
}
