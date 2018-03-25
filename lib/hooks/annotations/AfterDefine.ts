import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterDefine(target: any, propertyName: string): void;
export function AfterDefine(options: IHookOptions): Function;
export function AfterDefine(...args: any[]): void|Function {
  return implementHookDecorator('afterDefine', args);
}
