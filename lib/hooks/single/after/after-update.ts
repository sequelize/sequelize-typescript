import {HookOptions, implementHookDecorator} from "../../";

export function AfterUpdate(target: any, propertyName: string): void;
export function AfterUpdate(options: HookOptions): Function;
export function AfterUpdate(...args: any[]): void|Function {
  return implementHookDecorator('afterUpdate', args);
}
