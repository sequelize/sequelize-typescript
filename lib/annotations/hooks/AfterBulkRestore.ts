import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterBulkRestore(target: any, propertyName: string): void;
export function AfterBulkRestore(options: IHookOptions): Function;
export function AfterBulkRestore(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterBulkRestore', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterBulkRestore', propertyName);
  }
}
