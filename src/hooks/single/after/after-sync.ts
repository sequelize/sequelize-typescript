import {HookOptions, implementHookDecorator} from "../../";

export function AfterSync(target: any, propertyName: string): void;
export function AfterSync(options: HookOptions): Function;
export function AfterSync(...args: any[]): void|Function {
  return implementHookDecorator('afterSync', args);
}
