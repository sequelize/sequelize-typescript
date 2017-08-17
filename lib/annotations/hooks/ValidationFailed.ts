import {IHookOptions} from "../../interfaces/IHookOptions";
import {implementHookDecorator} from "../../services/hooks";

export function ValidationFailed(target: any, propertyName: string): void;
export function ValidationFailed(options: IHookOptions): Function;
export function ValidationFailed(...args: any[]): void|Function {
  return implementHookDecorator('validationFailed', args);
}
