import {HookOptions} from "../../hooks/shared/hook-options";

export interface ISequelizeHook {
  hookType: string;
  methodName: string;
  options?: HookOptions;
}
