import 'reflect-metadata';
import {SequelizeModelService} from "../utils/SequelizeModelService";
import {DefineOptions} from "sequelize";

export function Table(options: DefineOptions<any>): Function;
export function Table(target: any): void;
export function Table(arg: any): void|Function {

  if (typeof arg === 'function') {
    const target = arg;

    SequelizeModelService.setModelName(target.prototype, target.name);
    SequelizeModelService.setTableName(target.prototype, target.name);

  } else {

    const options = arg;

    return (target: any) => {

      SequelizeModelService.extendOptions(target.prototype, options);
      SequelizeModelService.setModelName(target.prototype, target.name);
      SequelizeModelService.setTableName(target.prototype, target.name);
    };
  }
}
