import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterFind(target: any, propertyName: string): void;
export function AfterFind(options: IHookOptions): Function;
export function AfterFind(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterFind', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterFind', propertyName);
  }
}
