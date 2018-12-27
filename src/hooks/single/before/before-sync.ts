import {HookOptions, implementHookDecorator} from "../../";

export function BeforeSync(target: any, propertyName: string): void;
export function BeforeSync(options: HookOptions): Function;
export function BeforeSync(...args: any[]): void|Function {
  return implementHookDecorator('beforeSync', args);
}
