import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterUpdate(target: any, propertyName: string): void;
export function AfterUpdate(options: IHookOptions): Function;
export function AfterUpdate(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterUpdate', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterUpdate', propertyName);
  }
}
