import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";
import {DataTypeAbstract} from "sequelize";

/**
 * Sets ype option for annotated property to specified value.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
export function Type(type: string | DataTypeAbstract) {

  return function (target: any, propertyName: string) {

    let options = SequelizeModelService.getAttributeOptions(target.constructor, propertyName);

    options.type = type;
  }
}
