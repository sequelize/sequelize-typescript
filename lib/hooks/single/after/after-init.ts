import {HookOptions, implementHookDecorator} from "../../";

export function AfterInit(target: any, propertyName: string): void;
export function AfterInit(options: HookOptions): Function;
export function AfterInit(...args: any[]): void|Function {
  return implementHookDecorator('afterInit', args);
}
