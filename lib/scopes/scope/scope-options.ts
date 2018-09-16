import {ScopeFindOptions} from "./find-include/scope-find-options";
import {ScopeTableOptions} from './scope-table-options';

export interface ScopeOptions extends ScopeTableOptions {

  defaultScope?: ScopeFindOptions | Function;
}
