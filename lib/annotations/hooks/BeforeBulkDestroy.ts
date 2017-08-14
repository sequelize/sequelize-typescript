import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeBulkDestroy(target: any, propertyName: string): void;
export function BeforeBulkDestroy(options: IHookOptions): Function;
export function BeforeBulkDestroy(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeBulkDestroy', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeBulkDestroy', propertyName);
  }
}
