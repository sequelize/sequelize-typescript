import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";

/**
 * Sets primary key option true for annotated property.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
export function PrimaryKey(target: any, propertyName: string){

  let options = SequelizeModelService.getAttributeOptions(target.constructor, propertyName);

  options.primaryKey = true;
}
