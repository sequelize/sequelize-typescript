import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeFindAfterOptions(target: any, propertyName: string): void;
export function BeforeFindAfterOptions(options: IHookOptions): Function;
export function BeforeFindAfterOptions(...args: any[]): void|Function {
  return implementHookDecorator('beforeFindAfterOptions', args);
}
