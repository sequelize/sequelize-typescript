import 'reflect-metadata';
import Sequelize = require("sequelize");
import {DataTypeAbstract} from "sequelize";
import {DefineAttributeColumnOptions} from "sequelize";
import {SequelizeModelService} from "../services/SequelizeModelService";

export function Column(options: DefineAttributeColumnOptions);
export function Column(dataType: DataTypeAbstract);
export function Column(target: any, propertyName: string);
export function Column(arg) {

  // In case of no specified options, we retrieve the
  // sequelize data type by the type of the property
  if(arguments.length === 2) {

    let target = arguments[0];
    let propertyName = arguments[1];

    const sequelizeType = SequelizeModelService.getSequelizeTypeByDesignType(target, propertyName);
    SequelizeModelService.addAttribute(target.constructor, propertyName, {type: sequelizeType});

    return;
  }

  return function (target: any, propertyName: string) {

    SequelizeModelService.addAttribute(target.constructor, propertyName, arg)
  }

}
