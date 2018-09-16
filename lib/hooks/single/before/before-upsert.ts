import {HookOptions, implementHookDecorator} from "../../";

export function BeforeUpsert(target: any, propertyName: string): void;
export function BeforeUpsert(options: HookOptions): Function;
export function BeforeUpsert(...args: any[]): void|Function {
  return implementHookDecorator('beforeUpsert', args);
}
