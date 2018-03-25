import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterCreate(target: any, propertyName: string): void;
export function AfterCreate(options: IHookOptions): Function;
export function AfterCreate(...args: any[]): void|Function {
  return implementHookDecorator('afterCreate', args);
}
