import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function BeforeFind(target: any, propertyName: string): void;
export function BeforeFind(options: IHookOptions): Function;
export function BeforeFind(...args: any[]): void|Function {
  return implementHookDecorator('beforeFind', args);
}
