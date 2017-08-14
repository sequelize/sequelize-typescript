import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeBulkDelete(target: any, propertyName: string): void;
export function BeforeBulkDelete(options: IHookOptions): Function;
export function BeforeBulkDelete(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeBulkDelete', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeBulkDelete', propertyName);
  }
}
