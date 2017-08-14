import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function BeforeUpdate(target: any, propertyName: string): void;
export function BeforeUpdate(options: IHookOptions): Function;
export function BeforeUpdate(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'beforeUpdate', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'beforeUpdate', propertyName);
  }
}
