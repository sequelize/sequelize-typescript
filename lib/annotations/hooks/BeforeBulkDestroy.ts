import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeBulkDestroy(target: any, propertyName: string): void;
export function BeforeBulkDestroy(options: IHookOptions): Function;
export function BeforeBulkDestroy(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkDestroy', args);
}
