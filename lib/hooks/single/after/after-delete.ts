import {HookOptions, implementHookDecorator} from "../../";

export function AfterDelete(target: any, propertyName: string): void;
export function AfterDelete(options: HookOptions): Function;
export function AfterDelete(...args: any[]): void|Function {
  return implementHookDecorator('afterDelete', args);
}
