import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeBulkRestore(target: any, propertyName: string): void;
export function BeforeBulkRestore(options: IHookOptions): Function;
export function BeforeBulkRestore(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeBulkRestore', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeBulkRestore', propertyName);
  }
}
