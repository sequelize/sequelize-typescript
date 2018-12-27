import {HookOptions, implementHookDecorator} from "../../";

export function BeforeDelete(target: any, propertyName: string): void;
export function BeforeDelete(options: HookOptions): Function;
export function BeforeDelete(...args: any[]): void|Function {
  return implementHookDecorator('beforeDelete', args);
}
