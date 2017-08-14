import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterDestroy(target: any, propertyName: string): void;
export function AfterDestroy(options: IHookOptions): Function;
export function AfterDestroy(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterDestroy', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterDestroy', propertyName);
  }
}
