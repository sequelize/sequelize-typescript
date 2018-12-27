import {HookOptions, implementHookDecorator} from "../../";

export function AfterSave(target: any, propertyName: string): void;
export function AfterSave(options: HookOptions): Function;
export function AfterSave(...args: any[]): void|Function {
  return implementHookDecorator('afterSave', args);
}
