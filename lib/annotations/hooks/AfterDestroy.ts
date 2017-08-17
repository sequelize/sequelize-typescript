import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function AfterDestroy(target: any, propertyName: string): void;
export function AfterDestroy(options: IHookOptions): Function;
export function AfterDestroy(...args: any[]): void|Function {
  return implementHookDecorator('afterDestroy', args);
}
