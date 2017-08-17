import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function AfterBulkUpdate(target: any, propertyName: string): void;
export function AfterBulkUpdate(options: IHookOptions): Function;
export function AfterBulkUpdate(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkUpdate', args);
}
