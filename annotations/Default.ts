import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";

/**
 * Sets the specified default value for the annotated field 
 */
export function Default(value: any) {

  return function (target: any, propertyName: string) {

    let options = SequelizeModelService.getAttributeOptions(target.constructor, propertyName);

    options.defaultValue = value;
  }
}
