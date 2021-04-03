import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function AfterBulkDestroy(target: any, propertyName: string): void;
export function AfterBulkDestroy(options: HookOptions): Function;
export function AfterBulkDestroy(...args: any[]): void | Function {
  return implementHookDecorator('afterBulkDestroy', args);
}
