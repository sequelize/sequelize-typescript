import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function BeforeFindAfterExpandIncludeAll(target: any, propertyName: string): void;
export function BeforeFindAfterExpandIncludeAll(options: HookOptions): Function;
export function BeforeFindAfterExpandIncludeAll(...args: any[]): void | Function {
  return implementHookDecorator('beforeFindAfterExpandIncludeAll', args);
}
