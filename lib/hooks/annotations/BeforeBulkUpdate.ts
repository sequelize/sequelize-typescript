import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeBulkUpdate(target: any, propertyName: string): void;
export function BeforeBulkUpdate(options: IHookOptions): Function;
export function BeforeBulkUpdate(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkUpdate', args);
}
