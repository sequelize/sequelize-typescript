import {HookOptions} from "./hook-options";
import {implementHookDecorator} from "./hooks-service";

export function ValidationFailed(target: any, propertyName: string): void;
export function ValidationFailed(options: HookOptions): Function;
export function ValidationFailed(...args: any[]): void | Function {
  return implementHookDecorator('validationFailed' as any, args);
}
