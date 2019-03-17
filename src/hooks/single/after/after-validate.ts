import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterValidate(target: any, propertyName: string): void;
export function AfterValidate(options: HookOptions): Function;
export function AfterValidate(...args: any[]): void | Function {
  return implementHookDecorator('afterValidate', args);
}
