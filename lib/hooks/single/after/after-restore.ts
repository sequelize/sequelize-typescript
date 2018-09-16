import {HookOptions, implementHookDecorator} from "../../";

export function AfterRestore(target: any, propertyName: string): void;
export function AfterRestore(options: HookOptions): Function;
export function AfterRestore(...args: any[]): void|Function {
  return implementHookDecorator('afterRestore', args);
}
