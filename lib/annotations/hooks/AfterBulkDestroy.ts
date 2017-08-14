import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterBulkDestroy(target: any, propertyName: string): void;
export function AfterBulkDestroy(options: IHookOptions): Function;
export function AfterBulkDestroy(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterBulkDestroy', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterBulkDestroy', propertyName);
  }
}
