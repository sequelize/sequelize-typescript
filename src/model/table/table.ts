import {TableOptions} from "./table-options";
import {Model} from "../model/model";
import {setModelName, addOptions} from "../shared/model-service";

export function Table(options: TableOptions): Function;
export function Table(target: Object): void;
export function Table(arg: any): void|Function {

  if (typeof arg === 'function') {
    annotate(arg);
  } else {
    const options: TableOptions = Object.assign({}, arg);
    return (target: any) => annotate(target, options);
  }
}

function annotate(target: typeof Model, options: TableOptions = {}): void {
  setModelName(target.prototype, options.modelName || target.name);
  addOptions(target.prototype, options);
}
