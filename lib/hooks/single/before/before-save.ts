import {HookOptions, implementHookDecorator} from "../../";

export function BeforeSave(target: any, propertyName: string): void;
export function BeforeSave(options: HookOptions): Function;
export function BeforeSave(...args: any[]): void|Function {
  return implementHookDecorator('beforeSave', args);
}
