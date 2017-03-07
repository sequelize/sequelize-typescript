import {IScopeFindOptions} from "./IScopeFindOptions";
import {IDefineScopeOptions} from "./IDefineScopeOptions";

export interface IScopeOptions extends IDefineScopeOptions {

  defaultScope?: IScopeFindOptions | Function;
}
