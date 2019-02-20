import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeDestroy(target: any, propertyName: string): void;
export function BeforeDestroy(options: HookOptions): Function;
export function BeforeDestroy(...args: any[]): void|Function {
  return implementHookDecorator('beforeDestroy', args);
}
