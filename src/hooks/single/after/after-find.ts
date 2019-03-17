import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function AfterFind(target: any, propertyName: string): void;
export function AfterFind(options: HookOptions): Function;
export function AfterFind(...args: any[]): void | Function {
  return implementHookDecorator('afterFind', args);
}
