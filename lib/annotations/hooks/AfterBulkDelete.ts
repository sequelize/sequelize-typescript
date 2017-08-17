import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function AfterBulkDelete(target: any, propertyName: string): void;
export function AfterBulkDelete(options: IHookOptions): Function;
export function AfterBulkDelete(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkDelete', args);
}
