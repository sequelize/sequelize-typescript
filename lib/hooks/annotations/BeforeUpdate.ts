import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeUpdate(target: any, propertyName: string): void;
export function BeforeUpdate(options: IHookOptions): Function;
export function BeforeUpdate(...args: any[]): void|Function {
  return implementHookDecorator('beforeUpdate', args);
}
