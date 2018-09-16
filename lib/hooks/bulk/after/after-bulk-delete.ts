import {HookOptions, implementHookDecorator} from "../../";

export function AfterBulkDelete(target: any, propertyName: string): void;
export function AfterBulkDelete(options: HookOptions): Function;
export function AfterBulkDelete(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkDelete', args);
}
