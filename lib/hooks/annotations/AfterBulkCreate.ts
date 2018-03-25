import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterBulkCreate(target: any, propertyName: string): void;
export function AfterBulkCreate(options: IHookOptions): Function;
export function AfterBulkCreate(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkCreate', args);
}
