import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeDestroy(target: any, propertyName: string): void;
export function BeforeDestroy(options: IHookOptions): Function;
export function BeforeDestroy(...args: any[]): void|Function {
  return implementHookDecorator('beforeDestroy', args);
}
