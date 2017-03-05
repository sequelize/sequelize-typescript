import 'reflect-metadata';
import {setModelName, addOptions} from "../services/models";
import {DefineOptions} from "sequelize";

export function Table(options: DefineOptions<any>): Function;
export function Table(target: any): void;
export function Table(arg: any): void|Function {

  if (typeof arg === 'function') {

    const target = arg;
    annotate(target);
  } else {

    const options: DefineOptions<any> = Object.assign({}, arg);

    return (target: any) => annotate(target, options);
  }
}

function annotate(target: any, options: DefineOptions<any> = {}): void {

  if (!options.tableName) options.tableName = target.name;

  options.instanceMethods = target.prototype;
  options.classMethods = target;

  setModelName(target.prototype, target.name);
  addOptions(target.prototype, options);
}
