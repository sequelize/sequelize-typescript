import {IScopeFindOptions} from "./IScopeFindOptions";
import {IDefineScopeOptions} from "./IDefineScopeOptions";

export interface IScopeOptions<T = any> extends IDefineScopeOptions<T> {

  defaultScope?: IScopeFindOptions<T> | Function;
}
