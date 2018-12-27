import {HookOptions, implementHookDecorator} from "../../";

export function BeforeBulkCreate(target: any, propertyName: string): void;
export function BeforeBulkCreate(options: HookOptions): Function;
export function BeforeBulkCreate(...args: any[]): void|Function {
  return implementHookDecorator('beforeBulkCreate', args);
}
