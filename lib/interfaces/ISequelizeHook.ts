import {IHookOptions} from "./IHookOptions";

export interface ISequelizeHook {
  hookType: string;
  methodName: string;
  options?: IHookOptions;
}
