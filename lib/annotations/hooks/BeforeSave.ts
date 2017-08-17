import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeSave(target: any, propertyName: string): void;
export function BeforeSave(options: IHookOptions): Function;
export function BeforeSave(...args: any[]): void|Function {
  return implementHookDecorator('beforeSave', args);
}
