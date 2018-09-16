import {HookOptions, implementHookDecorator} from "../../";

export function BeforeValidate(target: any, propertyName: string): void;
export function BeforeValidate(options: HookOptions): Function;
export function BeforeValidate(...args: any[]): void|Function {
  return implementHookDecorator('beforeValidate', args);
}
