import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterCreate(target: any, propertyName: string): void;
export function AfterCreate(options: HookOptions): Function;
export function AfterCreate(...args: any[]): void|Function {
  return implementHookDecorator('afterCreate', args);
}
