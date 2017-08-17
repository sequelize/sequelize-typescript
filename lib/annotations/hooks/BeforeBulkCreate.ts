import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeBulkCreate(target: any, propertyName: string): void;
export function BeforeBulkCreate(options: IHookOptions): Function;
export function BeforeBulkCreate(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkCreate', args);
}
