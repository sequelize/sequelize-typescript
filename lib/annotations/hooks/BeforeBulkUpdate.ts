import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeBulkUpdate(target: any, propertyName: string): void;
export function BeforeBulkUpdate(options: IHookOptions): Function;
export function BeforeBulkUpdate(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeBulkUpdate', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeBulkUpdate', propertyName);
  }
}
