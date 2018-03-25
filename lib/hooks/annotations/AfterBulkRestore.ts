import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterBulkRestore(target: any, propertyName: string): void;
export function AfterBulkRestore(options: IHookOptions): Function;
export function AfterBulkRestore(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkRestore', args);
}
