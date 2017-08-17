import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeBulkDelete(target: any, propertyName: string): void;
export function BeforeBulkDelete(options: IHookOptions): Function;
export function BeforeBulkDelete(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkDelete', args);
}
