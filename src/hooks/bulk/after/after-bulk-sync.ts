import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function AfterBulkSync(target: any, propertyName: string): void;
export function AfterBulkSync(options: HookOptions): Function;
export function AfterBulkSync(...args: any[]): void | Function {
  return implementHookDecorator('afterBulkSync', args);
}
