import {HookOptions, implementHookDecorator} from "../../";

export function BeforeBulkUpdate(target: any, propertyName: string): void;
export function BeforeBulkUpdate(options: HookOptions): Function;
export function BeforeBulkUpdate(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkUpdate', args);
}
