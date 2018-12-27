import {HookOptions, implementHookDecorator} from "../../";

export function BeforeFind(target: any, propertyName: string): void;
export function BeforeFind(options: HookOptions): Function;
export function BeforeFind(...args: any[]): void|Function {
  return implementHookDecorator('beforeFind', args);
}
