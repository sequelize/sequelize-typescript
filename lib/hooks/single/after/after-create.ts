import {HookOptions, implementHookDecorator} from "../../";

export function AfterCreate(target: any, propertyName: string): void;
export function AfterCreate(options: HookOptions): Function;
export function AfterCreate(...args: any[]): void|Function {
  return implementHookDecorator('afterCreate', args);
}
