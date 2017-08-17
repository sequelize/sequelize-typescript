import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeBulkSync(target: any, propertyName: string): void;
export function BeforeBulkSync(options: IHookOptions): Function;
export function BeforeBulkSync(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkSync', args);
}
