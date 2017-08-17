import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeValidate(target: any, propertyName: string): void;
export function BeforeValidate(options: IHookOptions): Function;
export function BeforeValidate(...args: any[]): void|Function {
  return implementHookDecorator('beforeValidate', args);
}
