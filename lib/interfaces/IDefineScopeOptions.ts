import {IScopeFindOptions} from "./IScopeFindOptions";

export interface IDefineScopeOptions {

  [scopeName: string]: IScopeFindOptions | Function | undefined;
}
