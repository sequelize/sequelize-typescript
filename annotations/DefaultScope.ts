import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";
import {DataTypeAbstract} from "sequelize";
import {DefineScopeOptions} from "sequelize";
import {FindOptions} from "sequelize";

/**
 * Sets default scope for annotated class
 */
export function DefaultScope(scope: FindOptions | Function) {

  return function (target: any) {

    let options = SequelizeModelService.getOptions(target);

    options.defaultScope = scope;
  }
}
