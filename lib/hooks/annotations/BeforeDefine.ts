import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeDefine(target: any, propertyName: string): void;
export function BeforeDefine(options: IHookOptions): Function;
export function BeforeDefine(...args: any[]): void|Function {
  return implementHookDecorator('beforeDefine', args);
}
