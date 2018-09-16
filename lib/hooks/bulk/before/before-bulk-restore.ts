import {HookOptions, implementHookDecorator} from "../../";

export function BeforeBulkRestore(target: any, propertyName: string): void;
export function BeforeBulkRestore(options: HookOptions): Function;
export function BeforeBulkRestore(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkRestore', args);
}
