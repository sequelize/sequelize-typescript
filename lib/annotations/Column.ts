import 'reflect-metadata';
import {DefineAttributeColumnOptions} from "sequelize";
import {SequelizeModelService} from "../services/SequelizeModelService";

export function Column(options: DefineAttributeColumnOptions): Function;
export function Column(target: any, propertyName: string): void;
export function Column(...args: any[]): Function|void {

  // In case of no specified options, we retrieve the
  // sequelize data type by the type of the property
  if (args.length >= 2) {

    const target = arguments[0];
    const propertyName = arguments[1];

    const sequelizeType = SequelizeModelService.getSequelizeTypeByDesignType(target, propertyName);
    const options = SequelizeModelService.getAttributeOptions(target.constructor, propertyName);
    options.type = sequelizeType;

    return;
  }

  return function(target: any, propertyName: string): void {

    SequelizeModelService.addAttribute(target.constructor, propertyName, args[0]);
  };
}
