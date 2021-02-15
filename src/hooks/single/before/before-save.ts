import { HookOptions } from '../../shared/hook-options';
import { implementHookDecorator } from '../../shared/hooks-service';

export function BeforeSave(target: any, propertyName: string): void;
export function BeforeSave(options: HookOptions): Function;
export function BeforeSave(...args: any[]): void | Function {
  return implementHookDecorator('beforeSave' as any, args);
}
