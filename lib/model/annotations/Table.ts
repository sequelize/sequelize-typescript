import 'reflect-metadata';
import {setModelName, addOptions} from "../models";
import {IDefineOptions} from "../interfaces/IDefineOptions";
import {ModelImpl} from '../models/ModelImpl';

export function Table(options: IDefineOptions): Function;
export function Table(target: any): void;
export function Table(arg: any): void|Function {

  if (typeof arg === 'function') {
    const target = arg;
    annotate(target);
  } else {
    const options: IDefineOptions = Object.assign({}, arg);
    return (target: any) => annotate(target, options);
  }
}

function annotate(target: typeof ModelImpl, options: IDefineOptions = {}): void {
  if (options.freezeTableName === undefined) options.freezeTableName = true;

  options.instanceMethods = target.prototype;
  options.classMethods = target;

  setModelName(target.prototype, options.modelName || target.name);
  addOptions(target.prototype, options);
}
