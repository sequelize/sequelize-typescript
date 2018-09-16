import {HookOptions, implementHookDecorator} from "../../";

export function BeforeFindAfterExpandIncludeAll(target: any, propertyName: string): void;
export function BeforeFindAfterExpandIncludeAll(options: HookOptions): Function;
export function BeforeFindAfterExpandIncludeAll(...args: any[]): void|Function {
  return implementHookDecorator('beforeFindAfterExpandIncludeAll', args);
}
