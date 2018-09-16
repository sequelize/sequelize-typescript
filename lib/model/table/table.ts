import 'reflect-metadata';
import {addOptions, setModelName} from '../shared/model-service';
import {TableOptions} from "./table-options";
import {ModelImpl} from '../model/model-impl';

export function Table(options: TableOptions): Function;
export function Table(target: any): void;
export function Table(arg: any): void|Function {

  if (typeof arg === 'function') {
    annotate(arg);
  } else {
    const options: TableOptions = Object.assign({}, arg);
    return (target: any) => annotate(target, options);
  }
}

function annotate(target: typeof ModelImpl, options: TableOptions = {}): void {
  options.instanceMethods = target.prototype;
  options.classMethods = target;

  setModelName(target.prototype, options.modelName || target.name);
  addOptions(target.prototype, options);
}
