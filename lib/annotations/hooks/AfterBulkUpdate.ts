import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterBulkUpdate(target: any, propertyName: string): void;
export function AfterBulkUpdate(options: IHookOptions): Function;
export function AfterBulkUpdate(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterBulkUpdate', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterBulkUpdate', propertyName);
  }
}
