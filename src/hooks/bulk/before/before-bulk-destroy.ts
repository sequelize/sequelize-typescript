import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function BeforeBulkDestroy(target: any, propertyName: string): void;
export function BeforeBulkDestroy(options: HookOptions): Function;
export function BeforeBulkDestroy(...args: any[]): void | Function {
  return implementHookDecorator('beforeBulkDestroy', args);
}
