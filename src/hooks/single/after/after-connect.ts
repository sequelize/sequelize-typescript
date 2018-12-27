import {HookOptions, implementHookDecorator} from "../../";

export function AfterConnect(target: any, propertyName: string): void;
export function AfterConnect(options: HookOptions): Function;
export function AfterConnect(...args: any[]): void|Function {
  return implementHookDecorator('afterConnect', args);
}
