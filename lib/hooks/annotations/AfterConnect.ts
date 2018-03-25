import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterConnect(target: any, propertyName: string): void;
export function AfterConnect(options: IHookOptions): Function;
export function AfterConnect(...args: any[]): void|Function {
  return implementHookDecorator('afterConnect', args);
}
