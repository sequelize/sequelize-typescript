import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterValidate(target: any, propertyName: string): void;
export function AfterValidate(options: IHookOptions): Function;
export function AfterValidate(...args: any[]): void|Function {
  return implementHookDecorator('afterValidate', args);
}
