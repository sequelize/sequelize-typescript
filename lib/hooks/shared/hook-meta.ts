import {HookOptions} from "./hook-options";

export interface HookMeta {
  hookType: string;
  methodName: string;
  options?: HookOptions;
}
