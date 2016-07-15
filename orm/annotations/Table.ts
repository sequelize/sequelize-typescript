import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";

export function Table(target: any) {

  let name = target.name;

  SequelizeModelService.setModelName(target, name);
  SequelizeModelService.setTableName(target, name);
}
