import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeUpsert(target: any, propertyName: string): void;
export function BeforeUpsert(options: IHookOptions): Function;
export function BeforeUpsert(...args: any[]): void|Function {
  return implementHookDecorator('beforeUpsert', args);
}
