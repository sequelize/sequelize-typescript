import 'reflect-metadata';
import {DefineAttributeColumnOptions} from "sequelize";
import {getSequelizeTypeByDesignType, addAttribute, getAttributeOptions} from "../utils/models";

export function Column(options: DefineAttributeColumnOptions): Function;
export function Column(target: any, propertyName: string): void;
export function Column(...args: any[]): Function|void {

  // In case of no specified options, we retrieve the
  // sequelize data type by the type of the property
  if (args.length >= 2) {

    const target = arguments[0];
    const propertyName = arguments[1];

    const sequelizeType = getSequelizeTypeByDesignType(target, propertyName);
    const options = getAttributeOptions(target, propertyName);
    options.type = sequelizeType;

    return;
  }

  return function(target: any, propertyName: string): void {

    addAttribute(target, propertyName, args[0]);
  };
}
