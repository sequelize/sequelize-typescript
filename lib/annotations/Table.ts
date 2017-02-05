import 'reflect-metadata';
import {setModelName, addOptions} from "../utils/models";
import {DefineOptions} from "sequelize";

export function Table(options: DefineOptions<any>): Function;
export function Table(target: any): void;
export function Table(arg: any): void|Function {

  if (typeof arg === 'function') {
    const target = arg;

    setModelName(target.prototype, target.name);
    addOptions(target.prototype, {
      tableName: target.name
    });

  } else {

    const options: DefineOptions<any> = arg;

    return (target: any) => {

      if (!options.tableName) options.tableName = target.name;

      setModelName(target.prototype, target.name);
      addOptions(target.prototype, options);
    };
  }
}
