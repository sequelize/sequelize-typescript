import {IHookOptions} from "../interfaces/IHookOptions";
import {implementHookDecorator} from "../hooks";

export function BeforeSync(target: any, propertyName: string): void;
export function BeforeSync(options: IHookOptions): Function;
export function BeforeSync(...args: any[]): void|Function {
  return implementHookDecorator('beforeSync', args);
}
