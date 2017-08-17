import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeBulkRestore(target: any, propertyName: string): void;
export function BeforeBulkRestore(options: IHookOptions): Function;
export function BeforeBulkRestore(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkRestore', args);
}
