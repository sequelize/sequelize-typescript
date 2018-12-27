import {HookOptions, implementHookDecorator} from "../../";

export function BeforeBulkDelete(target: any, propertyName: string): void;
export function BeforeBulkDelete(options: HookOptions): Function;
export function BeforeBulkDelete(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkDelete', args);
}
