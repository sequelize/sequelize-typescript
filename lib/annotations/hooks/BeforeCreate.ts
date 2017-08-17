import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeCreate(target: any, propertyName: string): void;
export function BeforeCreate(options: IHookOptions): Function;
export function BeforeCreate(...args: any[]): void|Function {
  return implementHookDecorator('beforeCreate', args);
}
