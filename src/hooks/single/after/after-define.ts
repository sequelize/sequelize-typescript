import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function AfterDefine(target: any, propertyName: string): void;
export function AfterDefine(options: HookOptions): Function;
export function AfterDefine(...args: any[]): void | Function {
  return implementHookDecorator('afterDefine', args);
}
