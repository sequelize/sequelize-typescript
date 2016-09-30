import 'reflect-metadata';
import Sequelize = require("sequelize");
import {SequelizeModelService} from "../services/SequelizeModelService";
import {DefineOptions} from "sequelize";

export function Table(options: DefineOptions<any>);
export function Table(target: any);
export function Table(any: any) {
  
  if(typeof any === 'function') {
    let target = any;

    SequelizeModelService.setModelName(target, target.name);
    SequelizeModelService.setTableName(target, target.name);
    
  } else {
    
    let options = any;
    
    return function (target: any) {
      
      SequelizeModelService.extendOptions(target, options);
      SequelizeModelService.setModelName(target, target.name);
      SequelizeModelService.setTableName(target, target.name);
    }
  }

}
