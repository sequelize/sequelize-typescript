import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";

/**
 * Sets auto increment true for annotated field
 */
export function AutoIncrement(target: any, propertyName: string) {

    let options = SequelizeModelService.getAttributeOptions(target.constructor, propertyName);

    options.autoIncrement = true;
}
