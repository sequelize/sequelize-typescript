import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterSave(target: any, propertyName: string): void;
export function AfterSave(options: HookOptions): Function;
export function AfterSave(...args: any[]): void | Function {
  return implementHookDecorator('afterSave' as any, args);
}
