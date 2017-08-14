import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeFind(target: any, propertyName: string): void;
export function BeforeFind(options: IHookOptions): Function;
export function BeforeFind(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeFind', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeFind', propertyName);
  }
}
