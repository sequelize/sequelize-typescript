import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeRestore(target: any, propertyName: string): void;
export function BeforeRestore(options: HookOptions): Function;
export function BeforeRestore(...args: any[]): void | Function {
  return implementHookDecorator('beforeRestore' as any, args);
}
