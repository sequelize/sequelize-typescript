import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterUpsert(target: any, propertyName: string): void;
export function AfterUpsert(options: HookOptions): Function;
export function AfterUpsert(...args: any[]): void | Function {
  return implementHookDecorator('afterUpsert' as any, args);
}
