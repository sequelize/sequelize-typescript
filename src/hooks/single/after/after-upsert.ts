import {HookOptions, implementHookDecorator} from "../../";

export function AfterUpsert(target: any, propertyName: string): void;
export function AfterUpsert(options: HookOptions): Function;
export function AfterUpsert(...args: any[]): void|Function {
  return implementHookDecorator('afterUpsert', args);
}
