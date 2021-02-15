import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function BeforeBulkRestore(target: any, propertyName: string): void;
export function BeforeBulkRestore(options: HookOptions): Function;
export function BeforeBulkRestore(...args: any[]): void | Function {
  return implementHookDecorator('beforeBulkRestore' as any, args);
}
