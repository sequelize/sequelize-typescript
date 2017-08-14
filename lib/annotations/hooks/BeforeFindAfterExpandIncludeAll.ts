import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeFindAfterExpandIncludeAll(target: any, propertyName: string): void;
export function BeforeFindAfterExpandIncludeAll(options: IHookOptions): Function;
export function BeforeFindAfterExpandIncludeAll(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeFindAfterExpandIncludeAll', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeFindAfterExpandIncludeAll', propertyName);
  }
}
