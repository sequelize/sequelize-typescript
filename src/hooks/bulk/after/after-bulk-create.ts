import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterBulkCreate(target: any, propertyName: string): void;
export function AfterBulkCreate(options: HookOptions): Function;
export function AfterBulkCreate(...args: any[]): void|Function {
  return implementHookDecorator('afterBulkCreate', args);
}
