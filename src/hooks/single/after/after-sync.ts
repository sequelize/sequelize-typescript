import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function AfterSync(target: any, propertyName: string): void;
export function AfterSync(options: HookOptions): Function;
export function AfterSync(...args: any[]): void | Function {
  return implementHookDecorator('afterSync', args);
}
