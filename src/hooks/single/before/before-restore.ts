import {HookOptions, implementHookDecorator} from "../../";

export function BeforeRestore(target: any, propertyName: string): void;
export function BeforeRestore(options: HookOptions): Function;
export function BeforeRestore(...args: any[]): void|Function {
  return implementHookDecorator('beforeRestore', args);
}
