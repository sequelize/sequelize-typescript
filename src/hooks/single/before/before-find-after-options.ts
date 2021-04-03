import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function BeforeFindAfterOptions(target: any, propertyName: string): void;
export function BeforeFindAfterOptions(options: HookOptions): Function;
export function BeforeFindAfterOptions(...args: any[]): void | Function {
  return implementHookDecorator('beforeFindAfterOptions', args);
}
