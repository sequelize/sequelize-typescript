import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function AfterSave(target: any, propertyName: string): void;
export function AfterSave(options: IHookOptions): Function;
export function AfterSave(...args: any[]): void|Function {
  return implementHookDecorator('afterSave', args);
}
