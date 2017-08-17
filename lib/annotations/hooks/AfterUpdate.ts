import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function AfterUpdate(target: any, propertyName: string): void;
export function AfterUpdate(options: IHookOptions): Function;
export function AfterUpdate(...args: any[]): void|Function {
  return implementHookDecorator('afterUpdate', args);
}
