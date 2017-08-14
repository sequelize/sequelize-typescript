import {IHookOptions} from "../../interfaces/IHookOptions";
import {addHook} from "../../services/hooks";

export function AfterBulkCreate(target: any, propertyName: string): void;
export function AfterBulkCreate(options: IHookOptions): Function;
export function AfterBulkCreate(...args: any[]): void|Function {

  if (args.length === 1) {

    const options = args[0];

    return (target: any, propertyName: string) =>
      addHook(target, 'afterBulkCreate', propertyName, options);
  } else {

    const target = args[0];
    const propertyName = args[1];

    addHook(target, 'afterBulkCreate', propertyName);
  }
}
