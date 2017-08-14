import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeFindAfterOptions(target: any, propertyName: string): void;
export function BeforeFindAfterOptions(options: IHookOptions): Function;
export function BeforeFindAfterOptions(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeFindAfterOptions', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeFindAfterOptions', propertyName);
  }
}
