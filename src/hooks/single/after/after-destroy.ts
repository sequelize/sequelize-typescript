import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterDestroy(target: any, propertyName: string): void;
export function AfterDestroy(options: HookOptions): Function;
export function AfterDestroy(...args: any[]): void|Function {
  return implementHookDecorator('afterDestroy', args);
}
