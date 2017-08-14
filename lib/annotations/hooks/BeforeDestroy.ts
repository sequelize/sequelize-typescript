import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeDestroy(target: any, propertyName: string): void;
export function BeforeDestroy(options: IHookOptions): Function;
export function BeforeDestroy(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeDestroy', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeDestroy', propertyName);
  }
}
