import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterFind(target: any, propertyName: string): void;
export function AfterFind(options: IHookOptions): Function;
export function AfterFind(...args: any[]): void|Function {
  return implementHookDecorator('afterFind', args);
}
