import {HookOptions, implementHookDecorator} from '../../';

export function AfterBulkRestore(target: any, propertyName: string): void;
export function AfterBulkRestore(options: HookOptions): Function;
export function AfterBulkRestore(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkRestore', args);
}
