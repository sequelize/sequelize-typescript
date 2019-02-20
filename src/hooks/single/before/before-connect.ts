import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeConnect(target: any, propertyName: string): void;
export function BeforeConnect(options: HookOptions): Function;
export function BeforeConnect(...args: any[]): void|Function {
  return implementHookDecorator('beforeConnect', args);
}
