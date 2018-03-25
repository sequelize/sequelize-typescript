import {IHookOptions} from "../../hooks/interfaces/IHookOptions";

export interface ISequelizeHook {
  hookType: string;
  methodName: string;
  options?: IHookOptions;
}
