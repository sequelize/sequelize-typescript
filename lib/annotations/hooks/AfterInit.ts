import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function AfterInit(target: any, propertyName: string): void;
export function AfterInit(options: IHookOptions): Function;
export function AfterInit(...args: any[]): void|Function {
  return implementHookDecorator('afterInit', args);
}
