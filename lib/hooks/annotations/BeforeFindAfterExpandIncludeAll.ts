import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeFindAfterExpandIncludeAll(target: any, propertyName: string): void;
export function BeforeFindAfterExpandIncludeAll(options: IHookOptions): Function;
export function BeforeFindAfterExpandIncludeAll(...args: any[]): void|Function {
  return implementHookDecorator('beforeFindAfterExpandIncludeAll', args);
}
