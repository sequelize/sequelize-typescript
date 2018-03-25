import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterUpsert(target: any, propertyName: string): void;
export function AfterUpsert(options: IHookOptions): Function;
export function AfterUpsert(...args: any[]): void|Function {
  return implementHookDecorator('afterUpsert', args);
}
