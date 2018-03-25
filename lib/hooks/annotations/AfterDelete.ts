import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterDelete(target: any, propertyName: string): void;
export function AfterDelete(options: IHookOptions): Function;
export function AfterDelete(...args: any[]): void|Function {
  return implementHookDecorator('afterDelete', args);
}
