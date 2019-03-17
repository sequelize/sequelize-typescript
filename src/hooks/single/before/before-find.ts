import {HookOptions} from "../../shared/hook-options";
import {implementHookDecorator} from "../../shared/hooks-service";

export function BeforeFind(target: any, propertyName: string): void;
export function BeforeFind(options: HookOptions): Function;
export function BeforeFind(...args: any[]): void | Function {
  return implementHookDecorator('beforeFind', args);
}
