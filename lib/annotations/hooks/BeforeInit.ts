import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeInit(target: any, propertyName: string): void;
export function BeforeInit(options: IHookOptions): Function;
export function BeforeInit(...args: any[]): void|Function {
  return implementHookDecorator('beforeInit', args);
}
