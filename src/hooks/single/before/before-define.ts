import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeDefine(target: any, propertyName: string): void;
export function BeforeDefine(options: HookOptions): Function;
export function BeforeDefine(...args: any[]): void|Function {
  return implementHookDecorator('beforeDefine', args);
}
