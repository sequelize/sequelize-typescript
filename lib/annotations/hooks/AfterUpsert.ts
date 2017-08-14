import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterUpsert(target: any, propertyName: string): void;
export function AfterUpsert(options: IHookOptions): Function;
export function AfterUpsert(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterUpsert', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterUpsert', propertyName);
  }
}
