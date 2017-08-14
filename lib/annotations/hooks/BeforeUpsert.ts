import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeUpsert(target: any, propertyName: string): void;
export function BeforeUpsert(options: IHookOptions): Function;
export function BeforeUpsert(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeUpsert', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeUpsert', propertyName);
  }
}
