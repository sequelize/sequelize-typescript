import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeDelete(target: any, propertyName: string): void;
export function BeforeDelete(options: IHookOptions): Function;
export function BeforeDelete(...args: any[]): void|Function {
  return implementHookDecorator('beforeDelete', args);
}
