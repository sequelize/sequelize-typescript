import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeConnect(target: any, propertyName: string): void;
export function BeforeConnect(options: IHookOptions): Function;
export function BeforeConnect(...args: any[]): void|Function {
  return implementHookDecorator('beforeConnect', args);
}
