import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";
import {DataTypeAbstract} from "sequelize";
import {DefineScopeOptions} from "sequelize";

/**
 * Sets scopes for annotated class
 */
export function Scopes(scopes: DefineScopeOptions) {

  return function (target: any) {

    let options = SequelizeModelService.getOptions(target);

    options.scopes = scopes;
  }
}
