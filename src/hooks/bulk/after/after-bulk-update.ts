import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterBulkUpdate(target: any, propertyName: string): void;
export function AfterBulkUpdate(options: HookOptions): Function;
export function AfterBulkUpdate(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkUpdate', args);
}
