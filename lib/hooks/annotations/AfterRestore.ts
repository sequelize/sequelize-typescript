import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterRestore(target: any, propertyName: string): void;
export function AfterRestore(options: IHookOptions): Function;
export function AfterRestore(...args: any[]): void|Function {
  return implementHookDecorator('afterRestore', args);
}
