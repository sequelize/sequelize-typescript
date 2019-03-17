import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeBulkSync(target: any, propertyName: string): void;
export function BeforeBulkSync(options: HookOptions): Function;
export function BeforeBulkSync(...args: any[]): void | Function {
  return implementHookDecorator('beforeBulkSync', args);
}
