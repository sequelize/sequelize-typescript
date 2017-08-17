import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function AfterSync(target: any, propertyName: string): void;
export function AfterSync(options: IHookOptions): Function;
export function AfterSync(...args: any[]): void|Function {
  return implementHookDecorator('afterSync', args);
}
