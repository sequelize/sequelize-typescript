import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function AfterRestore(target: any, propertyName: string): void;
export function AfterRestore(options: HookOptions): Function;
export function AfterRestore(...args: any[]): void | Function {
  return implementHookDecorator('afterRestore' as any, args);
}
