import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeCreate(target: any, propertyName: string): void;
export function BeforeCreate(options: HookOptions): Function;
export function BeforeCreate(...args: any[]): void|Function {
  return implementHookDecorator('beforeCreate', args);
}
