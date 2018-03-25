import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterBulkSync(target: any, propertyName: string): void;
export function AfterBulkSync(options: IHookOptions): Function;
export function AfterBulkSync(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkSync', args);
}
