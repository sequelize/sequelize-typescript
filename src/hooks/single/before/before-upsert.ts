import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeUpsert(target: any, propertyName: string): void;
export function BeforeUpsert(options: HookOptions): Function;
export function BeforeUpsert(...args: any[]): void|Function {
  return implementHookDecorator('beforeUpsert' as any, args);
}
