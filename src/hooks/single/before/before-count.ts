import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeCount(target: any, propertyName: string): void;
export function BeforeCount(options: HookOptions): Function;
export function BeforeCount(...args: any[]): void | Function {
  return implementHookDecorator('beforeCount', args);
}
