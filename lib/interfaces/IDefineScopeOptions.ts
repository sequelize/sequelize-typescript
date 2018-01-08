import {IScopeFindOptions} from "./IScopeFindOptions";

export interface IDefineScopeOptions<T = any> {

  [scopeName: string]: IScopeFindOptions<T> | Function | undefined;
}
