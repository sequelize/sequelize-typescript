import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterSave(target: any, propertyName: string): void;
export function AfterSave(options: IHookOptions): Function;
export function AfterSave(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterSave', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterSave', propertyName);
  }
}
