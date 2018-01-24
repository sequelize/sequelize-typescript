import 'reflect-metadata';
import {setModelName, addOptions} from "../services/models";
import {IDefineOptions} from "../interfaces/IDefineOptions";

export function Table(options: IDefineOptions): Function;
export function Table(target: any): Function;
export function Table(arg: any): void|Function {

  if (typeof arg === 'function') {

    const target = arg;
    annotate(target);
  } else {

    const options: IDefineOptions = Object.assign({}, arg);

    return (target: any) => annotate(target, options);
  }
}

function annotate(target: any, options: IDefineOptions = {}): void {

  if (options.freezeTableName === undefined) options.freezeTableName = true;

  options.instanceMethods = target.prototype;
  options.classMethods = target;

  setModelName(target.prototype, options.modelName || target.name);
  addOptions(target.prototype, options);
}
