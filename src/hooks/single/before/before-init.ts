import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeInit(target: any, propertyName: string): void;
export function BeforeInit(options: HookOptions): Function;
export function BeforeInit(...args: any[]): void|Function {
  return implementHookDecorator('beforeInit', args);
}
