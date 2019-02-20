import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeUpdate(target: any, propertyName: string): void;
export function BeforeUpdate(options: HookOptions): Function;
export function BeforeUpdate(...args: any[]): void|Function {
  return implementHookDecorator('beforeUpdate', args);
}
