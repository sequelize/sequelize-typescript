import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeRestore(target: any, propertyName: string): void;
export function BeforeRestore(options: IHookOptions): Function;
export function BeforeRestore(...args: any[]): void|Function {
  return implementHookDecorator('beforeRestore', args);
}
