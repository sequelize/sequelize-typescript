import {HookOptions, implementHookDecorator} from "../../";

export function AfterValidate(target: any, propertyName: string): void;
export function AfterValidate(options: HookOptions): Function;
export function AfterValidate(...args: any[]): void|Function {
  return implementHookDecorator('afterValidate', args);
}
