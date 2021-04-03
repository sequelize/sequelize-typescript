import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function AfterBulkRestore(target: any, propertyName: string): void;
export function AfterBulkRestore(options: HookOptions): Function;
export function AfterBulkRestore(...args: any[]): void | Function {
  return implementHookDecorator('afterBulkRestore' as any, args);
}
