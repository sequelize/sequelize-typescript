import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeCount(target: any, propertyName: string): void;
export function BeforeCount(options: IHookOptions): Function;
export function BeforeCount(...args: any[]): void|Function {
  return implementHookDecorator('beforeCount', args);
}
