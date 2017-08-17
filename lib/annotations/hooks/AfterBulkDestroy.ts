import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function AfterBulkDestroy(target: any, propertyName: string): void;
export function AfterBulkDestroy(options: IHookOptions): Function;
export function AfterBulkDestroy(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkDestroy', args);
}
